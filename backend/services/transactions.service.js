const Income = require('../models/income.model');
const Expense = require('../models/expense.model');

exports.getAllTransactions = async () => {
  const incomes = await Income.find().lean();
  const expenses = await Expense.find().lean();

  const formatted = [];
  incomes.forEach((i) => {
    formatted.push({
      ...i,
      type: 'income',
      _id: i._id.toString(),
    });
  });
  expenses.forEach((e) => {
    formatted.push({
      ...e,
      type: 'expense',
      _id: e._id.toString(),
    });
  });

  formatted.sort((a, b) => new Date(b.date) - new Date(a.date));
  return formatted;
};

exports.createTransaction = async (data) => {
  if (data.type === 'income') {
    const inc = await Income.create(data);
    return { ...inc.toObject(), type: 'income' };
  } else {
    const exp = await Expense.create(data);
    return { ...exp.toObject(), type: 'expense' };
  }
};

exports.deleteTransaction = async (id) => {
  let doc = await Income.findByIdAndDelete(id);
  if (doc) return { ...doc.toObject(), type: 'income' };
  doc = await Expense.findByIdAndDelete(id);
  if (doc) return { ...doc.toObject(), type: 'expense' };
  return null;
};

// summary similar to frontend logic
exports.getSummary = async () => {
  const incomeAgg = await Income.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const expenseAgg = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalIncome = incomeAgg[0] ? incomeAgg[0].total : 0;
  const totalExpense = expenseAgg[0] ? expenseAgg[0].total : 0;

  // chart data grouped by month; previously limited to the last six months,
  // but an empty result caused the front‑end line chart to show no data even
  // when transactions existed farther back. now we include all months so the
  // graph always reflects whatever is in the database.
  const expenseMonthly = await Expense.aggregate([
    { $addFields: { monthYear: { $substr: ['$date', 0, 7] } } },
    { $group: { _id: '$monthYear', total: { $sum: '$amount' } } },
    { $sort: { '_id': 1 } },
  ]);

  const incomeMonthly = await Income.aggregate([
    { $addFields: { monthYear: { $substr: ['$date', 0, 7] } } },
    { $group: { _id: '$monthYear', total: { $sum: '$amount' } } },
    { $sort: { '_id': 1 } },
  ]);

  // build unified chart array with zero defaults
  const monthsSet = new Set([
    ...expenseMonthly.map((m) => m._id),
    ...incomeMonthly.map((m) => m._id),
  ]);
  const chartData = Array.from(monthsSet)
    .sort()
    .map((month) => ({
      month,
      income: incomeMonthly.find((m) => m._id === month)?.total || 0,
      expense: expenseMonthly.find((m) => m._id === month)?.total || 0,
    }));

  // category breakdown (no need to match on nonexistent "type")
  const categoryBreakdown = await Expense.aggregate([
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $limit: 6 },
  ]);

  const categories = categoryBreakdown.map((item) => ({ category: item._id, amount: item.total }));

  return {
    totalIncome,
    totalExpense,
    netCashflow: totalIncome - totalExpense,
    savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
    chartData,
    categories,
  };
};
