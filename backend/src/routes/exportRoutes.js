const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/proposals/:id/excel', exportController.exportExcel);
router.get('/proposals/:id/csv', exportController.exportCSV);

module.exports = router;
