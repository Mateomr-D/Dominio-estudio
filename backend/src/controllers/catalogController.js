const { getDb } = require('../config/database');
const { deriveOMPFromReferences, calculatePERT } = require('../services/estimationService');

async function getComponents(req, res) {
  try {
    const db = getDb();
    const { includeInactive } = req.query;

    let query = 'SELECT * FROM componentes';
    const params = [];
    if (!includeInactive || includeInactive === 'false') {
      query += ' WHERE activo = 1';
    }
    query += ' ORDER BY categoria ASC, nombre ASC';

    const components = await db.query(query, params);

    // Obtener conteo de tareas para cada componente
    const componentsWithStats = await Promise.all(
      components.map(async (comp) => {
        const tasks = await db.query(
          'SELECT t.*, COUNT(r.id) as total_referencias FROM tareas t LEFT JOIN referencias_horas r ON t.id = r.tarea_id WHERE t.componente_id = ? GROUP BY t.id',
          [comp.id]
        );
        return {
          ...comp,
          activo: Boolean(comp.activo),
          total_tareas: tasks.length,
          tareas: tasks
        };
      })
    );

    res.json({ success: true, data: componentsWithStats });
  } catch (error) {
    console.error('Error en getComponents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getComponentById(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;

    const component = await db.get('SELECT * FROM componentes WHERE id = ?', [id]);
    if (!component) {
      return res.status(404).json({ success: false, error: 'Componente no encontrado' });
    }

    const tasks = await db.query(
      'SELECT * FROM tareas WHERE componente_id = ? ORDER BY id ASC',
      [id]
    );

    const tasksWithReferences = await Promise.all(
      tasks.map(async (task) => {
        const references = await db.query(
          'SELECT * FROM referencias_horas WHERE tarea_id = ? ORDER BY id ASC',
          [task.id]
        );
        const omp = deriveOMPFromReferences(references);
        const pert = calculatePERT(omp.O, omp.M, omp.P);

        return {
          ...task,
          referencias: references,
          calculo_base: {
            ...omp,
            ...pert
          }
        };
      })
    );

    res.json({
      success: true,
      data: {
        ...component,
        activo: Boolean(component.activo),
        tareas: tasksWithReferences
      }
    });
  } catch (error) {
    console.error('Error en getComponentById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function createComponent(req, res) {
  try {
    const db = getDb();
    const { nombre, descripcion, categoria, activo = 1 } = req.body;

    if (!nombre || !categoria) {
      return res.status(400).json({ success: false, error: 'Nombre y categoría son requeridos' });
    }

    const result = await db.run(
      'INSERT INTO componentes (nombre, descripcion, categoria, activo) VALUES (?, ?, ?, ?)',
      [nombre.trim(), descripcion ? descripcion.trim() : '', categoria.trim(), activo ? 1 : 0]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nombre: nombre.trim(),
        descripcion,
        categoria: categoria.trim(),
        activo: Boolean(activo)
      }
    });
  } catch (error) {
    console.error('Error en createComponent:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function updateComponent(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    const { nombre, descripcion, categoria, activo } = req.body;

    const existing = await db.get('SELECT * FROM componentes WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Componente no encontrado' });
    }

    await db.run(
      'UPDATE componentes SET nombre = ?, descripcion = ?, categoria = ?, activo = ? WHERE id = ?',
      [
        nombre !== undefined ? nombre.trim() : existing.nombre,
        descripcion !== undefined ? descripcion.trim() : existing.descripcion,
        categoria !== undefined ? categoria.trim() : existing.categoria,
        activo !== undefined ? (activo ? 1 : 0) : existing.activo,
        id
      ]
    );

    res.json({ success: true, message: 'Componente actualizado correctamente' });
  } catch (error) {
    console.error('Error en updateComponent:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function toggleComponentActive(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;

    const comp = await db.get('SELECT activo FROM componentes WHERE id = ?', [id]);
    if (!comp) {
      return res.status(404).json({ success: false, error: 'Componente no encontrado' });
    }

    const newStatus = comp.activo ? 0 : 1;
    await db.run('UPDATE componentes SET activo = ? WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: `Componente ${newStatus ? 'activado' : 'desactivado'} con éxito`,
      activo: Boolean(newStatus)
    });
  } catch (error) {
    console.error('Error en toggleComponentActive:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function createTask(req, res) {
  try {
    const db = getDb();
    const { id: componente_id } = req.params;
    const { nombre, descripcion, perfil, referencias = [] } = req.body;

    if (!nombre || !perfil) {
      return res.status(400).json({ success: false, error: 'Nombre de tarea y perfil técnico son requeridos' });
    }

    const comp = await db.get('SELECT id FROM componentes WHERE id = ?', [componente_id]);
    if (!comp) {
      return res.status(404).json({ success: false, error: 'Componente no encontrado' });
    }

    const taskRes = await db.run(
      'INSERT INTO tareas (componente_id, nombre, descripcion, perfil) VALUES (?, ?, ?, ?)',
      [componente_id, nombre.trim(), descripcion ? descripcion.trim() : '', perfil.trim()]
    );
    const taskId = taskRes.insertId;

    // Si se enviaron referencias iniciales
    if (Array.isArray(referencias) && referencias.length > 0) {
      for (const ref of referencias) {
        if (ref.proyecto_origen && ref.horas > 0) {
          await db.run(
            'INSERT INTO referencias_horas (tarea_id, proyecto_origen, horas, tipo, notas) VALUES (?, ?, ?, ?, ?)',
            [taskId, ref.proyecto_origen.trim(), Number(ref.horas), ref.tipo || 'estimada', ref.notas || null]
          );
        }
      }
    }

    res.status(201).json({
      success: true,
      data: { id: taskId, componente_id, nombre, descripcion, perfil }
    });
  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const db = getDb();
    const { taskId } = req.params;
    const { nombre, descripcion, perfil } = req.body;

    const existing = await db.get('SELECT * FROM tareas WHERE id = ?', [taskId]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    await db.run(
      'UPDATE tareas SET nombre = ?, descripcion = ?, perfil = ? WHERE id = ?',
      [
        nombre !== undefined ? nombre.trim() : existing.nombre,
        descripcion !== undefined ? descripcion.trim() : existing.descripcion,
        perfil !== undefined ? perfil.trim() : existing.perfil,
        taskId
      ]
    );

    res.json({ success: true, message: 'Tarea técnica actualizada correctamente' });
  } catch (error) {
    console.error('Error en updateTask:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const db = getDb();
    const { taskId } = req.params;

    await db.run('DELETE FROM tareas WHERE id = ?', [taskId]);
    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteTask:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function addHourReference(req, res) {
  try {
    const db = getDb();
    const { taskId } = req.params;
    const { proyecto_origen, horas, tipo = 'real', notas } = req.body;

    if (!proyecto_origen || !horas || Number(horas) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Proyecto de origen y horas (> 0) son obligatorios'
      });
    }

    const task = await db.get('SELECT id FROM tareas WHERE id = ?', [taskId]);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }

    const result = await db.run(
      'INSERT INTO referencias_horas (tarea_id, proyecto_origen, horas, tipo, notas) VALUES (?, ?, ?, ?, ?)',
      [taskId, proyecto_origen.trim(), Number(horas), tipo === 'real' ? 'real' : 'estimada', notas || null]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        tarea_id: taskId,
        proyecto_origen,
        horas: Number(horas),
        tipo,
        notas
      }
    });
  } catch (error) {
    console.error('Error en addHourReference:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function deleteHourReference(req, res) {
  try {
    const db = getDb();
    const { referenceId } = req.params;

    await db.run('DELETE FROM referencias_horas WHERE id = ?', [referenceId]);
    res.json({ success: true, message: 'Referencia de horas eliminada' });
  } catch (error) {
    console.error('Error en deleteHourReference:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getHistoricalProjects(req, res) {
  try {
    const db = getDb();
    const projects = await db.query(
      'SELECT DISTINCT proyecto_origen FROM referencias_horas ORDER BY proyecto_origen ASC'
    );
    res.json({
      success: true,
      data: projects.map((p) => p.proyecto_origen)
    });
  } catch (error) {
    console.error('Error en getHistoricalProjects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
  toggleComponentActive,
  createTask,
  updateTask,
  deleteTask,
  addHourReference,
  deleteHourReference,
  getHistoricalProjects
};
