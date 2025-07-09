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

    // Get user's problems
    const userProblems = await problems.find({ userId }).toArray()

    // Calculate statistics
    const totalProblems = userProblems.length
    const weeklyGoal = 100 // Default goal, could be user-configurable
    const currentStreak = calculateStreak(userProblems)
    const totalTopics = new Set(userProblems.map(p => p.category)).size

    // Calculate topic distribution
    const topicDistribution = userProblems.reduce((acc, problem) => {
      const category = problem.category || "Others"
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate progress over time (last 7 weeks)
    const progressData = calculateProgressData(userProblems)

    return NextResponse.json({
      stats: {
        totalProblems,
        weeklyGoal,
        currentStreak,
        totalTopics,
      },
      topicDistribution,
      progressData,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateStreak(problems: any[]): number {
  if (problems.length === 0) return 0

  const sortedProblems = problems
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 30; i++) { // Check last 30 days
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)

    const hasProblemOnDate = sortedProblems.some(problem => {
      const problemDate = new Date(problem.createdAt)
      problemDate.setHours(0, 0, 0, 0)
      return problemDate.getTime() === checkDate.getTime()
    })

    if (hasProblemOnDate) {
      streak++
    } else {
      break
    }
  }

  return streak
}

function calculateProgressData(problems: any[]): any[] {
  const progressData = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - (i * 7))
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const problemsInWeek = problems.filter(problem => {
      const problemDate = new Date(problem.createdAt)
      return problemDate >= weekStart && problemDate <= weekEnd
    }).length

    progressData.push({
      date: weekStart.toISOString().split('T')[0],
      problems: problemsInWeek,
    })
  }

  return progressData
} 