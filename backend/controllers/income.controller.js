const incomeService = require('../services/income.service');

exports.createIncome = async (req, res) => {
  try {
    const created = await incomeService.createIncome(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const list = await incomeService.getAllIncome();
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const deleted = await incomeService.deleteIncome(req.params.id);
    res.status(200).json({ success: true, data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
