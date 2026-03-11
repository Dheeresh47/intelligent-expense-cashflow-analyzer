"use client"

import {
  Line,
  LineChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

interface ChartData {
  month: string
  income: number
  expense: number
}

interface CategoryData {
  category: string
  amount: number
}

interface ExpenseChartsProps {
  chartData: ChartData[]
  categories: CategoryData[]
}

export function ExpenseCharts({ chartData, categories }: ExpenseChartsProps) {
  // Format month from "2024-09" to "Sep 2024"
  const formattedChartData = chartData.map((item) => {
    const [year, month] = item.month.split("-")
    const date = new Date(Number(year), Number(month) - 1)
    const monthName = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    return {
      ...item,
      month: monthName,
    }
  })

  const displayChartData = formattedChartData

  const pieChartColors = [
    "oklch(0.7 0.15 180)",
    "oklch(0.75 0.12 80)",
    "oklch(0.65 0.18 25)",
    "oklch(0.6 0.15 280)",
    "oklch(0.7 0.1 140)",
    "oklch(0.65 0.12 220)",
  ]

  const pieChartData = categories.map((item, index) => ({
    name: item.category,
    value: item.amount,
    fill: pieChartColors[index % pieChartColors.length],
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; dataKey: string; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="mb-2 font-semibold text-card-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey} : {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Monthly Income vs Expense Line Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 text-lg font-semibold text-card-foreground">
          Monthly Income vs Expense
        </h3>
        <div className="h-[300px]">
          {displayChartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No transaction data available yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayChartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 285)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="oklch(0.65 0 0)"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  stroke="oklch(0.65 0 0)"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span
                      className="text-sm"
                      style={{
                        color:
                          value === "expense"
                            ? "oklch(0.65 0.18 25)"
                            : "oklch(0.7 0.15 160)",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="oklch(0.65 0.18 25)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.65 0.18 25)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "oklch(0.65 0.18 25)" }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="oklch(0.7 0.15 160)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.7 0.15 160)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "oklch(0.7 0.15 160)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Expense Categories Pie Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 text-lg font-semibold text-card-foreground">
          Expense Categories
        </h3>
        <div className="h-[300px]">
          {pieChartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No expense data available yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.005 285)",
                    border: "1px solid oklch(0.28 0.01 285)",
                    borderRadius: "0.75rem",
                    color: "oklch(0.95 0 0)",
                  }}
                  formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "oklch(0.95 0 0)" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
