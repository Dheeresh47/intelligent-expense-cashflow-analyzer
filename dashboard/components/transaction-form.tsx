"use client"

import { useState } from "react"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface TransactionFormProps {
  onTransactionAdded?: () => void
}

export function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category || !date) return

    setIsSubmitting(true)

    const transaction = {
      amount: parseFloat(amount),
      type,
      category,
      date: format(date, "yyyy-MM-dd"),
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })

      if (response.ok) {
        onTransactionAdded?.()
        setAmount("")
        setCategory("")
        setDate(new Date())
        setType("expense")
      } else {
        const error = await response.json()
        console.error("Failed to submit transaction:", error)
      }
    } catch (error) {
      console.error("Failed to submit transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-card-foreground">
        Add Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-muted-foreground">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm text-muted-foreground">
              Type
            </Label>
            <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="income" className="text-income">
                  Income
                </SelectItem>
                <SelectItem value="expense" className="text-expense">
                  Expense
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm text-muted-foreground">
              Category
            </Label>
            <Input
              id="category"
              type="text"
              placeholder="e.g., Food, Rent, Salary"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-secondary border-border",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isSubmitting ? "Adding..." : "Add Transaction"}
        </Button>
      </form>
    </div>
  )
}
