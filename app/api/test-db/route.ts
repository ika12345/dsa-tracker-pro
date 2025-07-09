import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("dsa-app")
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray()
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      collections: collections.map(c => c.name)
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Database connection failed"
    }, { status: 500 })
  }
} 