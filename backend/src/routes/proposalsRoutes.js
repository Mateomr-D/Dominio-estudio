const express = require('express');
const router = express.Router();
const proposalsController = require('../controllers/proposalsController');

// Propuestas CRUD
router.get('/', proposalsController.getProposals);
router.get('/:id', proposalsController.getProposalById);
router.post('/', proposalsController.createProposal);
router.put('/:id', proposalsController.updateProposal);
router.delete('/:id', proposalsController.deleteProposal);

// Armado de solución y componentes
router.post('/:id/components', proposalsController.addComponentToProposal);
router.delete('/:id/components/:propCompId', proposalsController.removeComponentFromProposal);
router.patch('/:id/components/:propCompId/complexity', proposalsController.updateComponentComplexity);

// Edición manual de tareas con justificación (RF-09)
router.patch('/:id/tasks/:propTaskId/manual-edit', proposalsController.manualEditTask);
router.patch('/:id/tasks/:propTaskId/reset-manual-edit', proposalsController.resetManualEditTask);

// Registro de comparación con estimación manual y horas reales (RF-10)
router.patch('/:id/comparison', proposalsController.updateComparison);

module.exports = router;
