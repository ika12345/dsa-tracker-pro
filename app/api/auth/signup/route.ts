import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    console.log("Signup request received")
    
    const { name, email, password } = await req.json()
    console.log("Request data:", { name, email, password: password ? "[HIDDEN]" : "undefined" })
    
    if (!name || !email || !password) {
      console.log("Missing fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    console.log("Connecting to MongoDB...")
    const client = await clientPromise
    const db = client.db("dsa-app")
    const users = db.collection("users")
    console.log("MongoDB connected successfully")

    // Check if user exists
    console.log("Checking if user exists...")
    const existing = await users.findOne({ email })
    if (existing) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    console.log("Hashing password...")
    const hashed = await bcrypt.hash(password, 10)
    console.log("Password hashed successfully")

    // Store user
    console.log("Storing user in database...")
    const result = await users.insertOne({ name, email, password: hashed })
    console.log("User stored successfully:", result.insertedId)

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
