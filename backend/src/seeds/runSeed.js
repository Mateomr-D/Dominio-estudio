const path = require('path');
const fs = require('fs');
const { initDatabase } = require('../config/database');
const { initialComponents, historicalValidationProposal } = require('./initialData');
const {
  deriveOMPFromReferences,
  calculatePERT,
  getComplexityFactor,
  calculateAdjustedHours,
  calculateProposalTotals
} = require('../services/estimationService');
const { generateExcelMatrix, generateCSVMatrix } = require('../services/exportService');

async function runSeed() {
  console.log('[Seed] Iniciando carga de datos iniciales para Dominio Estudio...');
  const db = await initDatabase();

  // Limpiar datos existentes si se solicita con flag --force
  const force = process.argv.includes('--force');
  if (force) {
    console.log('[Seed] Flag --force detectada: reiniciando catálogo y propuestas...');
    await db.exec(`
      DELETE FROM propuesta_tareas;
      DELETE FROM propuesta_componentes;
      DELETE FROM propuestas;
      DELETE FROM referencias_horas;
      DELETE FROM tareas;
      DELETE FROM componentes;
    `);
  }

  // Verificar si ya existen componentes
  const existingComponents = await db.query('SELECT COUNT(*) as count FROM componentes');
  const count = existingComponents[0]?.count || 0;

  if (count > 0 && !force) {
    console.log(`[Seed] Ya existen ${count} componentes en la base de datos. Omitiendo seed repetido.`);
    return;
  }

  console.log('[Seed] Insertando componentes, tareas y referencias históricas...');

  const componentMap = new Map();
  const taskMap = new Map();

  for (const comp of initialComponents) {
    const compRes = await db.run(
      'INSERT INTO componentes (nombre, descripcion, categoria, activo) VALUES (?, ?, ?, ?)',
      [comp.nombre, comp.descripcion, comp.categoria, comp.activo]
    );
    const compId = compRes.insertId;
    componentMap.set(comp.nombre, compId);

    for (const t of comp.tareas) {
      const taskRes = await db.run(
        'INSERT INTO tareas (componente_id, nombre, descripcion, perfil) VALUES (?, ?, ?, ?)',
        [compId, t.nombre, t.descripcion, t.perfil]
      );
      const taskId = taskRes.insertId;
      taskMap.set(`${comp.nombre}::${t.nombre}`, taskId);

      for (const ref of t.referencias) {
        await db.run(
          'INSERT INTO referencias_horas (tarea_id, proyecto_origen, horas, tipo, notas) VALUES (?, ?, ?, ?, ?)',
          [taskId, ref.proyecto_origen, ref.horas, ref.tipo, ref.notas || null]
        );
      }
    }
  }

  console.log(`[Seed] Éxito: ${initialComponents.length} componentes y sus tareas insertados.`);

  // Ahora creamos la Propuesta Histórica de Validación (Sección 10 del documento)
  console.log('[Seed] Creando caso de validación histórica: Propuesta E-Commerce Artesanías y Reservas...');
  const p = historicalValidationProposal;

  const propRes = await db.run(
    `INSERT INTO propuestas 
      (nombre, referencia_cliente, tecnologias, fecha, estado, reserva_porcentaje, factor_baja, factor_media, factor_alta, estimacion_manual, horas_reales, notas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.nombre,
      p.referencia_cliente,
      p.tecnologias,
      p.fecha,
      p.estado,
      p.reserva_porcentaje,
      p.factor_baja,
      p.factor_media,
      p.factor_alta,
      p.estimacion_manual,
      p.horas_reales,
      p.notas
    ]
  );
  const propuestaId = propRes.insertId;

  const customFactors = {
    factor_baja: p.factor_baja,
    factor_media: p.factor_media,
    factor_alta: p.factor_alta
  };

  const componentesArmadosParaExport = [];

  for (const compItem of p.componentes) {
    const compId = componentMap.get(compItem.componenteNombre);
    if (!compId) continue;

    const factor_f = getComplexityFactor(compItem.complejidad, customFactors);

    const propCompRes = await db.run(
      'INSERT INTO propuesta_componentes (propuesta_id, componente_id, complejidad, factor_f) VALUES (?, ?, ?, ?)',
      [propuestaId, compId, compItem.complejidad, factor_f]
    );
    const propCompId = propCompRes.insertId;

    // Obtener tareas del componente
    const tareasDb = await db.query('SELECT * FROM tareas WHERE componente_id = ?', [compId]);
    const tareasArmadas = [];

    for (const tarea of tareasDb) {
      // Obtener referencias históricas para derivar O, M, P
      const refs = await db.query('SELECT * FROM referencias_horas WHERE tarea_id = ?', [tarea.id]);
      const { O, M, P, fuente } = deriveOMPFromReferences(refs);
      const { horasEsperadas, desviacion } = calculatePERT(O, M, P);
      const horasAjustadas = calculateAdjustedHours(horasEsperadas, factor_f);

      // En el caso histórico, dejamos una tarea con edición manual justificada para verificar RF-09
      let horasEditadas = null;
      let justificacion = null;
      let editadoManualmente = 0;
      let horasFinales = horasAjustadas;

      if (tarea.nombre.includes('Webhook de confirmación')) {
        editadoManualmente = 1;
        horasEditadas = 18.0;
        justificacion = 'Ajuste solicitado por personal senior debido a complejidad adicional en conciliación bancaria.';
        horasFinales = 18.0;
      }

      await db.run(
        `INSERT INTO propuesta_tareas 
          (propuesta_componente_id, tarea_id, O, M, P, horas_esperadas, horas_ajustadas, desviacion, horas_editadas, justificacion, editado_manualmente)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          propCompId,
          tarea.id,
          O,
          M,
          P,
          horasEsperadas,
          horasFinales,
          desviacion,
          horasEditadas,
          justificacion,
          editadoManualmente
        ]
      );

      tareasArmadas.push({
        id: tarea.id,
        nombre: tarea.nombre,
        perfil: tarea.perfil,
        O,
        M,
        P,
        horas_esperadas: horasEsperadas,
        horas_ajustadas: horasFinales,
        desviacion: desviacion,
        horas_editadas: horasEditadas,
        justificacion,
        editado_manualmente: editadoManualmente,
        fuente
      });
    }

    componentesArmadosParaExport.push({
      id: compId,
      nombre: compItem.componenteNombre,
      complejidad: compItem.complejidad,
      factor_f: factor_f,
      tareas: tareasArmadas
    });
  }

  // Generar archivos de ejemplo exportados para los entregables (RF-08 y Sección 13)
  console.log('[Seed] Generando Matriz de Estimación de Ejemplo (Excel y CSV)...');
  const totals = calculateProposalTotals(componentesArmadosParaExport, {
    reserva_porcentaje: p.reserva_porcentaje
  });

  const excelBuffer = await generateExcelMatrix(p, totals);
  const csvContent = generateCSVMatrix(p, totals);

  const docsDir = path.resolve(__dirname, '../../../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(docsDir, 'matriz_estimacion_ejemplo.xlsx'), excelBuffer);
  fs.writeFileSync(path.join(docsDir, 'matriz_estimacion_ejemplo.csv'), csvContent, 'utf-8');

  console.log('[Seed] Archivos de ejemplo generados en docs/matriz_estimacion_ejemplo.xlsx y .csv');
  console.log('[Seed] Carga de datos completada satisfactoriamente.');
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}

module.exports = { runSeed };
