import { type NextRequest, NextResponse } from "next/server"

// Mock problems database
interface Problem {
  id: number
  title: string
  difficulty: string
  category: string
  status: string
  notes?: string
  createdAt: string
  userId: number
}

const problems: Problem[] = []

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const problemData = await request.json()

    const newProblem: Problem = {
      id: problems.length + 1,
      ...problemData,
      createdAt: new Date().toISOString(),
      userId: 1, // Extract from token in real app
    }

    problems.push(newProblem)

    return NextResponse.json({
      message: "Problem tracked successfully",
      problem: newProblem,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Filter problems by user (in real app)
    const userProblems = problems.filter((p) => p.userId === 1)

    return NextResponse.json({
      problems: userProblems,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
