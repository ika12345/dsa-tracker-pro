import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    message: "Signup endpoint is accessible",
    testData: {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    return NextResponse.json({ 
      message: "POST request received",
      receivedData: body
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to parse request body",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 400 })
  }
} 