import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  try {
    // Get token from headers
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    const client = await clientPromise
    const db = client.db("dsa-app")
    const problems = db.collection("problems")

    // Get user's recent problems (last 10)
    const recentProblems = await problems
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    // Format the data for display
    const recentActivity = recentProblems.map(problem => ({
      problem: problem.title,
      topic: problem.category,
      difficulty: problem.difficulty,
      date: new Date(problem.createdAt).toISOString().split('T')[0],
    }))

    return NextResponse.json({ recentActivity })
  } catch (error) {
    console.error("Recent activity error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 