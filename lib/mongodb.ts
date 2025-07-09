import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  // @ts-expect-error - global type not available
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    // @ts-expect-error - global type not available
    global._mongoClientPromise = client.connect()
  }
  // @ts-expect-error - global type not available
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise