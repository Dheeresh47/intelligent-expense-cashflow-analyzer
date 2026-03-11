const Expense = require('../models/expense.model');

exports.createExpense = async (data) => {
  const expense = new Expense(data);
  return await expense.save();
};

exports.getAllExpense = async () => {
  return await Expense.find().sort({ date: -1 });
};

exports.deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};
