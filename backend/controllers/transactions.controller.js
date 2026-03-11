const transactionsService = require('../services/transactions.service');

exports.getTransactions = async (req, res) => {
  try {
    const results = await transactionsService.getAllTransactions();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const created = await transactionsService.createTransaction(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await transactionsService.deleteTransaction(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summary = await transactionsService.getSummary();
    res.status(200).json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};
