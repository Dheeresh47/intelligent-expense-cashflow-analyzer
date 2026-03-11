const expenseService = require('../services/expense.service');

exports.createExpense = async (req, res) => {
  try {
    const created = await expenseService.createExpense(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const list = await expenseService.getAllExpense();
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await expenseService.deleteExpense(req.params.id);
    res.status(200).json({ success: true, data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
