const Income = require('../models/income.model');

exports.createIncome = async (data) => {
  const income = new Income(data);
  return await income.save();
};

exports.getAllIncome = async () => {
  return await Income.find().sort({ date: -1 });
};

exports.deleteIncome = async (id) => {
  return await Income.findByIdAndDelete(id);
};
