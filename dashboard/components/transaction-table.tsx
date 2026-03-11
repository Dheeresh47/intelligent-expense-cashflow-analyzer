"use client"

import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Transaction {
  _id: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground">
          Recent Transactions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your latest financial activity
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-right text-muted-foreground">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions yet. Add your first transaction above.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow
                  key={transaction._id}
                  className="border-border hover:bg-secondary/50"
                >
                  <TableCell className="font-medium text-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    <span className="text-foreground">{transaction.category}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`gap-1 border-0 ${
                        transaction.type === "income"
                          ? "bg-income/10 text-income"
                          : "bg-expense/10 text-expense"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-semibold ${
                        transaction.type === "income" ? "text-income" : "text-expense"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(transaction._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete transaction</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
