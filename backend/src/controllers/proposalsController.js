const { getDb } = require('../config/database');
const {
  deriveOMPFromReferences,
  calculatePERT,
  getComplexityFactor,
  calculateAdjustedHours,
  calculateProposalTotals,
  calculateComparison
} = require('../services/estimationService');

async function getProposals(req, res) {
  try {
    const db = getDb();
    const proposals = await db.query('SELECT * FROM propuestas ORDER BY creado_en DESC');

    const result = await Promise.all(
      proposals.map(async (p) => {
        // Obtener componentes de la propuesta
        const propComponents = await db.query(
          `SELECT pc.*, c.nombre as componente_nombre, c.categoria 
           FROM propuesta_componentes pc 
           JOIN componentes c ON pc.componente_id = c.id 
           WHERE pc.propuesta_id = ?`,
          [p.id]
        );

        // Para cada componente, obtener sus tareas
        const componentesData = await Promise.all(
          propComponents.map(async (pc) => {
            const tareas = await db.query(
              `SELECT pt.*, t.nombre, t.perfil 
               FROM propuesta_tareas pt 
               JOIN tareas t ON pt.tarea_id = t.id 
               WHERE pt.propuesta_componente_id = ?`,
              [pc.id]
            );
            return {
              id: pc.id,
              componente_id: pc.componente_id,
              nombre: pc.componente_nombre,
              categoria: pc.categoria,
              complejidad: pc.complejidad,
              factor_f: pc.factor_f,
              tareas: tareas
            };
          })
        );

        const totals = calculateProposalTotals(componentesData, {
          reserva_porcentaje: p.reserva_porcentaje
        });

        const comparacion = calculateComparison({
          totalEstimado: totals.total_con_reserva,
          estimacionManual: p.estimacion_manual,
          horasReales: p.horas_reales
        });

        return {
          ...p,
          total_componentes: propComponents.length,
          totales: totals,
          comparacion: comparacion
        };
      })
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error en getProposals:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getProposalById(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;

    const proposal = await db.get('SELECT * FROM propuestas WHERE id = ?', [id]);
    if (!proposal) {
      return res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
    }

    const propComponents = await db.query(
      `SELECT pc.*, c.nombre as componente_nombre, c.categoria, c.descripcion as componente_descripcion
       FROM propuesta_componentes pc 
       JOIN componentes c ON pc.componente_id = c.id 
       WHERE pc.propuesta_id = ?
       ORDER BY pc.id ASC`,
      [id]
    );

    const componentesData = await Promise.all(
      propComponents.map(async (pc) => {
        const tareas = await db.query(
          `SELECT pt.*, t.nombre, t.descripcion as tarea_descripcion, t.perfil 
           FROM propuesta_tareas pt 
           JOIN tareas t ON pt.tarea_id = t.id 
           WHERE pt.propuesta_componente_id = ?
           ORDER BY pt.id ASC`,
          [pc.id]
        );

        // Enriquecer tareas con sus referencias históricas para máxima trazabilidad
        const tareasConTrazabilidad = await Promise.all(
          tareas.map(async (t) => {
            const referencias = await db.query(
              'SELECT * FROM referencias_horas WHERE tarea_id = ? ORDER BY id ASC',
              [t.tarea_id]
            );
            const ompInfo = deriveOMPFromReferences(referencias);
            return {
              ...t,
              editado_manualmente: Boolean(t.editado_manualmente),
              referencias_historicas: referencias,
              fuente_trazabilidad: ompInfo.fuente
            };
          })
        );

        return {
          id: pc.id,
          componente_id: pc.componente_id,
          nombre: pc.componente_nombre,
          descripcion: pc.componente_descripcion,
          categoria: pc.categoria,
          complejidad: pc.complejidad,
          factor_f: pc.factor_f,
          tareas: tareasConTrazabilidad
        };
      })
    );

    const totals = calculateProposalTotals(componentesData, {
      reserva_porcentaje: proposal.reserva_porcentaje
    });

    const comparacion = calculateComparison({
      totalEstimado: totals.total_con_reserva,
      estimacionManual: proposal.estimacion_manual,
      horasReales: proposal.horas_reales
    });

    res.json({
      success: true,
      data: {
        ...proposal,
        componentes: totals.componentes,
        totales: totals,
        comparacion: comparacion
      }
    });
  } catch (error) {
    console.error('Error en getProposalById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function createProposal(req, res) {
  try {
    const db = getDb();
    const {
      nombre,
      referencia_cliente,
      tecnologias,
      fecha = new Date().toISOString().slice(0, 10),
      reserva_porcentaje = 10.0,
      factor_baja = 0.8,
      factor_media = 1.0,
      factor_alta = 1.3,
      estimacion_manual = null,
      horas_reales = null,
      notas = '',
      componentes_ids = [] // Opcional: armado inicial rápido
    } = req.body;

    if (!nombre || !referencia_cliente || !tecnologias) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, referencia de cliente y tecnologías son obligatorios'
      });
    }

    const result = await db.run(
      `INSERT INTO propuestas 
        (nombre, referencia_cliente, tecnologias, fecha, estado, reserva_porcentaje, factor_baja, factor_media, factor_alta, estimacion_manual, horas_reales, notas)
       VALUES (?, ?, ?, ?, 'Borrador', ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        referencia_cliente.trim(),
        tecnologias.trim(),
        fecha,
        Number(reserva_porcentaje),
        Number(factor_baja),
        Number(factor_media),
        Number(factor_alta),
        estimacion_manual ? Number(estimacion_manual) : null,
        horas_reales ? Number(horas_reales) : null,
        notas ? notas.trim() : ''
      ]
    );

    const propuestaId = result.insertId;

    // Si se enviaron componentes para armar de una vez
    if (Array.isArray(componentes_ids) && componentes_ids.length > 0) {
      for (const compItem of componentes_ids) {
        const compId = typeof compItem === 'object' ? compItem.id : compItem;
        const complejidad = typeof compItem === 'object' && compItem.complejidad ? compItem.complejidad : 'media';
        await addComponentLogic(db, propuestaId, compId, complejidad, {
          factor_baja,
          factor_media,
          factor_alta
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Propuesta creada exitosamente',
      data: { id: propuestaId }
    });
  } catch (error) {
    console.error('Error en createProposal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function updateProposal(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    const {
      nombre,
      referencia_cliente,
      tecnologias,
      fecha,
      estado,
      reserva_porcentaje,
      factor_baja,
      factor_media,
      factor_alta,
      estimacion_manual,
      horas_reales,
      notas
    } = req.body;

    const existing = await db.get('SELECT * FROM propuestas WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
    }

    await db.run(
      `UPDATE propuestas SET 
        nombre = ?,
        referencia_cliente = ?,
        tecnologias = ?,
        fecha = ?,
        estado = ?,
        reserva_porcentaje = ?,
        factor_baja = ?,
        factor_media = ?,
        factor_alta = ?,
        estimacion_manual = ?,
        horas_reales = ?,
        notas = ?
       WHERE id = ?`,
      [
        nombre !== undefined ? nombre.trim() : existing.nombre,
        referencia_cliente !== undefined ? referencia_cliente.trim() : existing.referencia_cliente,
        tecnologias !== undefined ? tecnologias.trim() : existing.tecnologias,
        fecha !== undefined ? fecha : existing.fecha,
        estado !== undefined ? estado : existing.estado,
        reserva_porcentaje !== undefined ? Number(reserva_porcentaje) : existing.reserva_porcentaje,
        factor_baja !== undefined ? Number(factor_baja) : existing.factor_baja,
        factor_media !== undefined ? Number(factor_media) : existing.factor_media,
        factor_alta !== undefined ? Number(factor_alta) : existing.factor_alta,
        estimacion_manual !== undefined ? (estimacion_manual !== null ? Number(estimacion_manual) : null) : existing.estimacion_manual,
        horas_reales !== undefined ? (horas_reales !== null ? Number(horas_reales) : null) : existing.horas_reales,
        notas !== undefined ? notas.trim() : existing.notas,
        id
      ]
    );

    // Si cambiaron factores de complejidad, recalcular tareas asociadas
    if (
      (factor_baja !== undefined && factor_baja !== existing.factor_baja) ||
      (factor_media !== undefined && factor_media !== existing.factor_media) ||
      (factor_alta !== undefined && factor_alta !== existing.factor_alta)
    ) {
      await recalculateProposalLogic(db, id);
    }

    res.json({ success: true, message: 'Propuesta actualizada correctamente' });
  } catch (error) {
    console.error('Error en updateProposal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function deleteProposal(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;

    await db.run('DELETE FROM propuestas WHERE id = ?', [id]);
    res.json({ success: true, message: 'Propuesta eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteProposal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Lógica auxiliar para agregar un componente y calcular sus tareas iniciales
 */
async function addComponentLogic(db, propuestaId, componenteId, complejidad = 'media', factors = {}) {
  // Verificar si ya está en la propuesta
  const existing = await db.get(
    'SELECT id FROM propuesta_componentes WHERE propuesta_id = ? AND componente_id = ?',
    [propuestaId, componenteId]
  );
  if (existing) {
    return existing.id;
  }

  const factor_f = getComplexityFactor(complejidad, factors);

  const pcRes = await db.run(
    'INSERT INTO propuesta_componentes (propuesta_id, componente_id, complejidad, factor_f) VALUES (?, ?, ?, ?)',
    [propuestaId, componenteId, complejidad, factor_f]
  );
  const propCompId = pcRes.insertId;

  // Obtener tareas del componente del catálogo
  const tasks = await db.query('SELECT * FROM tareas WHERE componente_id = ?', [componenteId]);

  for (const task of tasks) {
    const refs = await db.query('SELECT * FROM referencias_horas WHERE tarea_id = ?', [task.id]);
    const { O, M, P } = deriveOMPFromReferences(refs);
    const { horasEsperadas, desviacion } = calculatePERT(O, M, P);
    const horasAjustadas = calculateAdjustedHours(horasEsperadas, factor_f);

    await db.run(
      `INSERT INTO propuesta_tareas 
        (propuesta_componente_id, tarea_id, O, M, P, horas_esperadas, horas_ajustadas, desviacion, horas_editadas, justificacion, editado_manualmente)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, 0)`,
      [propCompId, task.id, O, M, P, horasEsperadas, horasAjustadas, desviacion]
    );
  }

  return propCompId;
}

async function addComponentToProposal(req, res) {
  try {
    const db = getDb();
    const { id: propuestaId } = req.params;
    const { componente_id, complejidad = 'media' } = req.body;

    if (!componente_id) {
      return res.status(400).json({ success: false, error: 'componente_id es requerido' });
    }

    const proposal = await db.get('SELECT * FROM propuestas WHERE id = ?', [propuestaId]);
    if (!proposal) {
      return res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
    }

    const factors = {
      factor_baja: proposal.factor_baja,
      factor_media: proposal.factor_media,
      factor_alta: proposal.factor_alta
    };

    const propCompId = await addComponentLogic(db, propuestaId, componente_id, complejidad, factors);

    res.status(201).json({
      success: true,
      message: 'Componente incorporado a la propuesta exitosamente',
      data: { propuesta_componente_id: propCompId }
    });
  } catch (error) {
    console.error('Error en addComponentToProposal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function removeComponentFromProposal(req, res) {
  try {
    const db = getDb();
    const { propCompId } = req.params;

    await db.run('DELETE FROM propuesta_componentes WHERE id = ?', [propCompId]);
    res.json({ success: true, message: 'Componente removido de la propuesta' });
  } catch (error) {
    console.error('Error en removeComponentFromProposal:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function updateComponentComplexity(req, res) {
  try {
    const db = getDb();
    const { id: propuestaId, propCompId } = req.params;
    const { complejidad } = req.body;

    if (!complejidad || !['baja', 'media', 'alta'].includes(complejidad.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Complejidad inválida. Debe ser baja, media o alta'
      });
    }

    const proposal = await db.get('SELECT * FROM propuestas WHERE id = ?', [propuestaId]);
    if (!proposal) {
      return res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
    }

    const factors = {
      factor_baja: proposal.factor_baja,
      factor_media: proposal.factor_media,
      factor_alta: proposal.factor_alta
    };

    const newFactor = getComplexityFactor(complejidad, factors);

    // Actualizar componente
    await db.run(
      'UPDATE propuesta_componentes SET complejidad = ?, factor_f = ? WHERE id = ?',
      [complejidad.toLowerCase(), newFactor, propCompId]
    );

    // Recalcular horas ajustadas de las tareas asociadas (si no fueron editadas manualmente)
    const tareas = await db.query(
      'SELECT * FROM propuesta_tareas WHERE propuesta_componente_id = ?',
      [propCompId]
    );

    for (const t of tareas) {
      if (!t.editado_manualmente) {
        const horasAjustadas = calculateAdjustedHours(t.horas_esperadas, newFactor);
        await db.run(
          'UPDATE propuesta_tareas SET horas_ajustadas = ? WHERE id = ?',
          [horasAjustadas, t.id]
        );
      }
    }

    res.json({
      success: true,
      message: `Complejidad actualizada a ${complejidad} (factor f=${newFactor})`,
      factor_f: newFactor
    });
  } catch (error) {
    console.error('Error en updateComponentComplexity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function manualEditTask(req, res) {
  try {
    const db = getDb();
    const { propTaskId } = req.params;
    const { horas, justificacion } = req.body;

    if (horas === undefined || Number(horas) <= 0) {
      return res.status(400).json({ success: false, error: 'Las horas deben ser mayores a cero' });
    }

    if (!justificacion || justificacion.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Conforme a RF-09 y política de trazabilidad, se requiere una justificación válida (mínimo 5 caracteres)'
      });
    }

    const task = await db.get('SELECT * FROM propuesta_tareas WHERE id = ?', [propTaskId]);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Tarea de propuesta no encontrada' });
    }

    const horasEditadas = Number(Number(horas).toFixed(2));

    await db.run(
      `UPDATE propuesta_tareas SET 
        horas_editadas = ?,
        horas_ajustadas = ?,
        justificacion = ?,
        editado_manualmente = 1
       WHERE id = ?`,
      [horasEditadas, horasEditadas, justificacion.trim(), propTaskId]
    );

    res.json({
      success: true,
      message: 'Horas editadas manualmente registradas con justificación',
      data: {
        id: propTaskId,
        horas_ajustadas: horasEditadas,
        horas_esperadas_pert: task.horas_esperadas,
        justificacion: justificacion.trim()
      }
    });
  } catch (error) {
    console.error('Error en manualEditTask:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function resetManualEditTask(req, res) {
  try {
    const db = getDb();
    const { propTaskId } = req.params;

    const task = await db.get(
      `SELECT pt.*, pc.factor_f 
       FROM propuesta_tareas pt 
       JOIN propuesta_componentes pc ON pt.propuesta_componente_id = pc.id 
       WHERE pt.id = ?`,
      [propTaskId]
    );

    if (!task) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    const horasAjustadas = calculateAdjustedHours(task.horas_esperadas, task.factor_f);

    await db.run(
      `UPDATE propuesta_tareas SET 
        horas_editadas = NULL,
        horas_ajustadas = ?,
        justificacion = NULL,
        editado_manualmente = 0
       WHERE id = ?`,
      [horasAjustadas, propTaskId]
    );

    res.json({
      success: true,
      message: 'Edición manual restablecida a la estimación paramétrica PERT',
      horas_ajustadas: horasAjustadas
    });
  } catch (error) {
    console.error('Error en resetManualEditTask:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function updateComparison(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    const { estimacion_manual, horas_reales, estado } = req.body;

    const proposal = await db.get('SELECT * FROM propuestas WHERE id = ?', [id]);
    if (!proposal) {
      return res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
    }

    await db.run(
      `UPDATE propuestas SET 
        estimacion_manual = ?,
        horas_reales = ?,
        estado = ?
       WHERE id = ?`,
      [
        estimacion_manual !== undefined ? (estimacion_manual ? Number(estimacion_manual) : null) : proposal.estimacion_manual,
        horas_reales !== undefined ? (horas_reales ? Number(horas_reales) : null) : proposal.horas_reales,
        estado || proposal.estado || 'Comparada',
        id
      ]
    );

    res.json({ success: true, message: 'Datos de comparación registrados exitosamente' });
  } catch (error) {
    console.error('Error en updateComparison:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function recalculateProposalLogic(db, propuestaId) {
  const proposal = await db.get('SELECT * FROM propuestas WHERE id = ?', [propuestaId]);
  if (!proposal) return;

  const factors = {
    factor_baja: proposal.factor_baja,
    factor_media: proposal.factor_media,
    factor_alta: proposal.factor_alta
  };

  const pcs = await db.query(
    'SELECT * FROM propuesta_componentes WHERE propuesta_id = ?',
    [propuestaId]
  );

  for (const pc of pcs) {
    const factor_f = getComplexityFactor(pc.complejidad, factors);
    await db.run('UPDATE propuesta_componentes SET factor_f = ? WHERE id = ?', [factor_f, pc.id]);

    const tasks = await db.query(
      'SELECT * FROM propuesta_tareas WHERE propuesta_componente_id = ?',
      [pc.id]
    );

    for (const t of tasks) {
      if (!t.editado_manualmente) {
        const { horasEsperadas, desviacion } = calculatePERT(t.O, t.M, t.P);
        const horasAjustadas = calculateAdjustedHours(horasEsperadas, factor_f);
        await db.run(
          'UPDATE propuesta_tareas SET horas_esperadas = ?, horas_ajustadas = ?, desviacion = ? WHERE id = ?',
          [horasEsperadas, horasAjustadas, desviacion, t.id]
        );
      }
    }
  }
}

module.exports = {
  getProposals,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
  addComponentToProposal,
  removeComponentFromProposal,
  updateComponentComplexity,
  manualEditTask,
  resetManualEditTask,
  updateComparison
};
