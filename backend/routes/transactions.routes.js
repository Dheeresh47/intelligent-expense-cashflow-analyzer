const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

router.get('/', transactionsController.getTransactions);
router.get('/summary', transactionsController.getSummary);
router.post('/', transactionsController.createTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

module.exports = router;
