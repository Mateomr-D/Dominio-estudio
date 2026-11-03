const { getDb } = require('../config/database');
const { calculateProposalTotals } = require('../services/estimationService');
const { generateExcelMatrix, generateCSVMatrix } = require('../services/exportService');

async function getProposalFullData(propuestaId) {
  const db = getDb();
  const proposal = await db.get('SELECT * FROM propuestas WHERE id = ?', [propuestaId]);
  if (!proposal) return null;

  const propComponents = await db.query(
    `SELECT pc.*, c.nombre as componente_nombre, c.categoria 
     FROM propuesta_componentes pc 
     JOIN componentes c ON pc.componente_id = c.id 
     WHERE pc.propuesta_id = ?
     ORDER BY pc.id ASC`,
    [propuestaId]
  );

  const componentesData = await Promise.all(
    propComponents.map(async (pc) => {
      const tareas = await db.query(
        `SELECT pt.*, t.nombre, t.perfil 
         FROM propuesta_tareas pt 
         JOIN tareas t ON pt.tarea_id = t.id 
         WHERE pt.propuesta_componente_id = ?
         ORDER BY pt.id ASC`,
        [pc.id]
      );
      return {
        id: pc.id,
        nombre: pc.componente_nombre,
        categoria: pc.categoria,
        complejidad: pc.complejidad,
        factor_f: pc.factor_f,
        tareas: tareas.map((t) => ({
          ...t,
          editado_manualmente: Boolean(t.editado_manualmente)
        }))
      };
    })
  );

  const totals = calculateProposalTotals(componentesData, {
    reserva_porcentaje: proposal.reserva_porcentaje
  });

  return { proposal, totals };
}

async function exportExcel(req, res) {
  try {
    const { id } = req.params;
    const data = await getProposalFullData(id);

    if (!data) {
      return res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
    }

    const buffer = await generateExcelMatrix(data.proposal, data.totals);
    const safeName = data.proposal.nombre.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `Matriz_Estimacion_${safeName}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error en exportExcel:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function exportCSV(req, res) {
  try {
    const { id } = req.params;
    const data = await getProposalFullData(id);

    if (!data) {
      return res.status(404).json({ success: false, error: 'Propuesta no encontrada' });
    }

    const csvContent = generateCSVMatrix(data.proposal, data.totals);
    const safeName = data.proposal.nombre.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `Matriz_Estimacion_${safeName}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error en exportCSV:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  exportExcel,
  exportCSV
};
