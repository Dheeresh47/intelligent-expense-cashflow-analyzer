import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    // Aggregate to get totals
    const summary = await db
      .collection("transactions")
      .aggregate([
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ])
      .toArray()

    let totalIncome = 0
    let totalExpense = 0

    summary.forEach((item) => {
      if (item._id === "income") {
        totalIncome = item.total
      } else if (item._id === "expense") {
        totalExpense = item.total
      }
    })

    // Get monthly data for the chart (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12)

    const monthlyData = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            date: { $gte: sixMonthsAgo.toISOString().split("T")[0] },
          },
        },
        {
          $addFields: {
            monthYear: { $substr: ["$date", 0, 7] },
          },
        },
        {
          $group: {
            _id: {
              monthYear: "$monthYear",
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: { "_id.monthYear": 1 },
        },
      ])
      .toArray()

    // Transform monthly data for the chart
    const monthlyMap: Record<string, { income: number; expense: number }> = {}

    monthlyData.forEach((item) => {
      const month = item._id.monthYear
      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 }
      }
      if (item._id.type === "income") {
        monthlyMap[month].income = item.total
      } else {
        monthlyMap[month].expense = item.total
      }
    })

    const chartData = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))

    // Get category breakdown for expenses
    const categoryBreakdown = await db
      .collection("transactions")
      .aggregate([
        {
          $match: { type: "expense" },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: { total: -1 },
        },
        {
          $limit: 6,
        },
      ])
      .toArray()

    const categories = categoryBreakdown.map((item) => ({
      category: item._id,
      amount: item.total,
    }))

    return NextResponse.json({
      totalIncome,
      totalExpense,
      netCashflow: totalIncome - totalExpense,
      savingsRate:
        totalIncome > 0
          ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
          : 0,
      chartData,
      categories,
    })
  } catch (error) {
    console.error("Failed to fetch summary:", error)
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    )
  }
}
