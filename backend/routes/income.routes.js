const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');

// income CRUD
router.post('/', incomeController.createIncome);
router.get('/', incomeController.getIncomes);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
