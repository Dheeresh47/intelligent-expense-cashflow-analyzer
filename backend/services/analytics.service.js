const Income = require('../models/income.model');
const Expense = require('../models/expense.model');

function round(num) {
  return Math.round(num * 100) / 100;
}

exports.getAnalytics = async () => {
  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // totals
  const incomeAgg = await Income.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const expenseAgg = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const totalIncome = incomeAgg[0] ? incomeAgg[0].total : 0;
  const totalExpense = expenseAgg[0] ? expenseAgg[0].total : 0;
  const balance = totalIncome - totalExpense;

  // daily burn rate over last 90 days
  const burnAgg = await Expense.aggregate([
    { $match: { date: { $gte: ninetyDaysAgo, $lte: now } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const burnTotal = burnAgg[0] ? burnAgg[0].total : 0;
  const dailyBurn = round(burnTotal / 90);

  // runway days
  const runwayDays = dailyBurn > 0 ? round(balance / dailyBurn) : null;

  // savings ratio
  const savingsRatio = totalIncome > 0 ? round((balance) / totalIncome) : null;

  // monthly expense growth
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = startOfThisMonth;

  const thisMonthAgg = await Expense.aggregate([
    { $match: { date: { $gte: startOfThisMonth, $lt: now } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const lastMonthAgg = await Expense.aggregate([
    { $match: { date: { $gte: startOfLastMonth, $lt: endOfLastMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const thisMonthExpense = thisMonthAgg[0] ? thisMonthAgg[0].total : 0;
  const lastMonthExpense = lastMonthAgg[0] ? lastMonthAgg[0].total : 0;

  let expenseGrowth = null;
  if (lastMonthExpense > 0) {
    expenseGrowth = round(((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100);
  }

  // health score points
  let savingsScoreP = 0;
  if (savingsRatio !== null) {
    if (savingsRatio > 0.2) savingsScoreP = 40;
    else if (savingsRatio >= 0.1) savingsScoreP = 25;
    else savingsScoreP = 10;
  }

  let runwayScoreP = 0;
  if (runwayDays !== null) {
    if (runwayDays > 90) runwayScoreP = 30;
    else if (runwayDays >= 30) runwayScoreP = 20;
    else runwayScoreP = 10;
  }

  let growthScoreP = 0;
  if (expenseGrowth !== null) {
    if (expenseGrowth < 0) growthScoreP = 30;
    else if (expenseGrowth <= 10) growthScoreP = 20;
    else growthScoreP = 10;
  }

  const healthScore = round(savingsScoreP + runwayScoreP + growthScoreP);

  // generate textual insights
  const insights = [];
  // savings
  if (savingsRatio !== null) {
    if (savingsRatio > 0.2) {
      insights.push('Your savings ratio is healthy.');
    } else if (savingsRatio >= 0.1) {
      insights.push('Your savings ratio is moderate.');
    } else {
      insights.push('Your savings ratio is low. Consider reducing expenses.');
    }
  }
  // runway
  if (runwayDays !== null) {
    if (runwayDays > 90) {
      insights.push('You have strong financial runway.');
    } else if (runwayDays >= 30) {
      insights.push('Your financial runway is stable.');
    } else {
      insights.push('Your current burn rate is risky. Savings may run out soon.');
    }
  }
  // expense growth
  if (expenseGrowth !== null) {
    if (expenseGrowth < 0) {
      insights.push('Your spending has reduced compared to last month.');
    } else if (expenseGrowth <= 10) {
      insights.push('Spending is slightly increasing.');
    } else {
      insights.push('Spending has significantly increased compared to last month.');
    }
  }
  // balance
  if (balance < 0) {
    insights.push('You are currently in deficit.');
  } else {
    insights.push('You are maintaining a positive balance.');
  }

  return {
    totalIncome: round(totalIncome),
    totalExpense: round(totalExpense),
    balance: round(balance),
    dailyBurn,
    runwayDays,
    savingsRatio,
    expenseGrowth,
    healthScore,
    insights,
  };
};
