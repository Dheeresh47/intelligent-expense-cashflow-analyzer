import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Transaction {
  _id?: string | ObjectId
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  description?: string
  createdAt?: Date
}

// GET all transactions
export async function GET() {
  try {
    const db = await getDatabase()
    const transactions = await db
      .collection<Transaction>("transactions")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray()

    // Convert ObjectId to string for JSON serialization
    const serializedTransactions = transactions.map((t) => ({
      ...t,
      _id: t._id?.toString(),
    }))

    return NextResponse.json(serializedTransactions)
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

// POST new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, type, category, date, description } = body

    // Validation
    if (!amount || !type || !category || !date) {
      return NextResponse.json(
        { error: "Missing required fields: amount, type, category, date" },
        { status: 400 }
      )
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      )
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const newTransaction: Transaction = {
      amount: Number(amount),
      type,
      category: category.trim(),
      date,
      description: description?.trim() || "",
      createdAt: new Date(),
    }

    const result = await db
      .collection<Transaction>("transactions")
      .insertOne(newTransaction)

    return NextResponse.json(
      {
        ...newTransaction,
        _id: result.insertedId.toString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    )
  }
}

// DELETE transaction
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const result = await db
      .collection("transactions")
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Failed to delete transaction:", error)
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    )
  }
}
