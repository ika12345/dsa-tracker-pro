import { type NextRequest, NextResponse } from "next/server"

// Mock analytics storage
interface ABTestData {
  id: number
  variant: string
  page: string
  timestamp: string
  userId: number
  sessionId: string
}

const abTestData: ABTestData[] = []

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { variant, page, timestamp } = await request.json()

    const testData: ABTestData = {
      id: abTestData.length + 1,
      variant,
      page,
      timestamp,
      userId: 1, // Extract from token in real app
      sessionId: `session_${Date.now()}`,
    }

    abTestData.push(testData)

    return NextResponse.json({
      message: "A/B test data recorded",
      data: testData,
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

    // Return aggregated A/B test results
    const variantA = abTestData.filter((d) => d.variant === "difficulty-based").length
    const variantB = abTestData.filter((d) => d.variant === "topic-based").length

    return NextResponse.json({
      results: {
        variantA: {
          name: "Difficulty-based",
          users: variantA,
          conversionRate: 0.65, // Mock data
        },
        variantB: {
          name: "Topic-based",
          users: variantB,
          conversionRate: 0.72, // Mock data
        },
      },
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
