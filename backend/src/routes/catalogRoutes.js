const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Componentes
router.get('/components', catalogController.getComponents);
router.get('/components/:id', catalogController.getComponentById);
router.post('/components', catalogController.createComponent);
router.put('/components/:id', catalogController.updateComponent);
router.patch('/components/:id/toggle-active', catalogController.toggleComponentActive);

// Tareas técnicas
router.post('/components/:id/tasks', catalogController.createTask);
router.put('/tasks/:taskId', catalogController.updateTask);
router.delete('/tasks/:taskId', catalogController.deleteTask);

// Referencias de horas (RF-03)
router.post('/tasks/:taskId/references', catalogController.addHourReference);
router.delete('/references/:referenceId', catalogController.deleteHourReference);

// Proyectos históricos registrados
router.get('/historical-projects', catalogController.getHistoricalProjects);

module.exports = router;
