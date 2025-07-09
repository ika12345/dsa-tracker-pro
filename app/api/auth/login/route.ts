import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("dsa-app")
  const users = db.collection("users")

  const user = await users.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  // Create JWT
  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user

  return NextResponse.json({ token, user: userWithoutPassword })
}
