import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("dsa-app")
  const users = db.collection("users")

  // Check if user exists
  const existing = await users.findOne({ email })
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 })
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10)

  // Store user
  await users.insertOne({ name, email, password: hashed })

  return NextResponse.json({ message: "Account created successfully!" }, { status: 201 })
}
