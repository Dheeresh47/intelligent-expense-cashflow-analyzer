"use client"

import { useCallback } from "react"
import useSWR from "swr"
import { Activity, Zap } from "lucide-react"
import { TransactionForm } from "@/components/transaction-form"
import { SummaryCards } from "@/components/summary-cards"
import { TransactionTable } from "@/components/transaction-table"
import { ExpenseCharts } from "@/components/expense-charts"
import { Spinner } from "@/components/ui/spinner"

export interface Transaction {
  _id: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  description?: string
}

interface Summary {
  totalIncome: number
  totalExpense: number
  netCashflow: number
  savingsRate: number
  chartData: { month: string; income: number; expense: number }[]
  categories: { category: string; amount: number }[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch")
  }
  return res.json()
}

export default function HomePage() {
  const {
    data: transactionsData,
    mutate: mutateTransactions,
    isLoading: transactionsLoading,
  } = useSWR<Transaction[]>("/api/transactions", fetcher)

  // Ensure transactions is always an array
  const transactions = Array.isArray(transactionsData) ? transactionsData : []

  const {
    data: summary,
    mutate: mutateSummary,
    isLoading: summaryLoading,
  } = useSWR<Summary>("/api/transactions/summary", fetcher)

  const handleTransactionAdded = useCallback(async () => {
    // Revalidate both transactions and summary after adding
    await Promise.all([mutateTransactions(), mutateSummary()])
  }, [mutateTransactions, mutateSummary])

  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/transactions?id=${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          await Promise.all([mutateTransactions(), mutateSummary()])
        }
      } catch (error) {
        console.error("Failed to delete transaction:", error)
      }
    },
    [mutateTransactions, mutateSummary]
  )

  const isLoading = transactionsLoading || summaryLoading

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Intelligent Expense Cashflow Analyzer
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Track your finances with AI-powered insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-income" />
            <span className="hidden sm:inline">Live</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <section>
              <SummaryCards
                totalIncome={summary?.totalIncome ?? 0}
                totalExpense={summary?.totalExpense ?? 0}
              />
            </section>

            {/* Form and Table Grid */}
            <section className="grid gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
              </div>
              <div className="lg:col-span-3">
                <TransactionTable
                  transactions={transactions.slice(0, 7)}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            </section>

            {/* Charts */}
            <section>
              <ExpenseCharts
                chartData={summary?.chartData ?? []}
                categories={summary?.categories ?? []}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>
            Intelligent Expense Cashflow Analyzer — Built for smarter financial
            decisions
          </p>
        </div>
      </footer>
    </div>
  )
}
