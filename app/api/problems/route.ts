import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    console.log("Creating problem for userId:", userId)

    const problemData = await request.json()
    console.log("Problem data:", problemData)

    const client = await clientPromise
    const db = client.db("dsa-app")
    const problems = db.collection("problems")

    const newProblem = {
      ...problemData,
      userId: userId,
      createdAt: new Date().toISOString(),
    }

    console.log("Saving problem:", newProblem)

    const result = await problems.insertOne(newProblem)
    console.log("Problem saved with ID:", result.insertedId)

    return NextResponse.json({
      message: "Problem tracked successfully",
      problem: { ...newProblem, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error tracking problem:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    console.log("Fetching problems for userId:", userId)

    const client = await clientPromise
    const db = client.db("dsa-app")
    const problems = db.collection("problems")

    const userProblems = await problems.find({ userId }).toArray()
    console.log("Found problems:", userProblems.length)

    return NextResponse.json({
      problems: userProblems,
    })
  } catch (error) {
    console.error("Error fetching problems:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
