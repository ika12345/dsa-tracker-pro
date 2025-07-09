import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { problemName, topic, difficulty, concepts } = await request.json()

    const prompt = `
      Explain the problem "${problemName}" which is a ${difficulty} level ${topic} problem.
      
      Key concepts involved: ${concepts.join(", ")}
      
      Please provide:
      1. A brief explanation of what the problem is asking
      2. The main approach or algorithm to solve it
      3. Key insights or patterns to recognize
      4. Time and space complexity
      5. Common pitfalls to avoid
      
      Keep the explanation clear and educational, suitable for someone learning DSA.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are an expert programming tutor specializing in data structures and algorithms. Provide clear, educational explanations that help students understand both the problem and the underlying concepts.",
    })

    return NextResponse.json({
      explanation: text,
    })
  } catch (error) {
    console.error("AI explanation error:", error)
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 })
  }
}
