"use client"

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
}

export function SummaryCards({ totalIncome, totalExpense }: SummaryCardsProps) {
  const netCashflow = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round((netCashflow / totalIncome) * 100) : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {/* Total Income */}
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-income/50 hover:shadow-lg hover:shadow-income/5">
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-income/10 blur-2xl transition-all group-hover:bg-income/20" />
        <div className="relative flex flex-col items-center text-center">
          <span className="mb-3 text-sm font-semibold text-muted-foreground">
            Total Income
          </span>
          <p className="text-2xl font-bold text-income lg:text-3xl">
            {formatCurrency(totalIncome)}
          </p>
        </div>
      </div>

      {/* Total Expense */}
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-expense/50 hover:shadow-lg hover:shadow-expense/5">
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-expense/10 blur-2xl transition-all group-hover:bg-expense/20" />
        <div className="relative flex flex-col items-center text-center">
          <span className="mb-3 text-sm font-semibold text-muted-foreground">
            Total Expense
          </span>
          <p className="text-2xl font-bold text-expense lg:text-3xl">
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      {/* Net Cashflow */}
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-income/50 hover:shadow-lg hover:shadow-income/5">
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-income/10 blur-2xl transition-all group-hover:bg-income/20" />
        <div className="relative flex flex-col items-center text-center">
          <span className="mb-3 text-sm font-semibold text-muted-foreground">
            Net Cashflow
          </span>
          <p className={`text-2xl font-bold lg:text-3xl ${netCashflow >= 0 ? "text-income" : "text-expense"}`}>
            {formatCurrency(netCashflow)}
          </p>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
        <div className="relative flex flex-col items-center text-center">
          <span className="mb-3 text-sm font-semibold text-muted-foreground">
            Savings Rate
          </span>
          <p className="text-2xl font-bold text-primary lg:text-3xl">
            {savingsRate}%
          </p>
        </div>
      </div>
    </div>
  )
}
