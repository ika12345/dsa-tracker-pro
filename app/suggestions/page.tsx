"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Brain, Target, Zap, ExternalLink, RefreshCw, MessageCircle } from "lucide-react"
import Link from "next/link"

// A/B Testing variants
const VARIANT_A = "difficulty-based"
const VARIANT_B = "topic-based"

const suggestionsVariantA = [
  {
    id: 1,
    name: "Container With Most Water",
    difficulty: "Medium",
    topic: "Arrays",
    reason: "You've mastered easy array problems. Time for medium!",
    url: "https://leetcode.com/problems/container-with-most-water/",
    estimatedTime: "25 min",
    concepts: ["Two Pointers", "Greedy"],
  },
  {
    id: 2,
    name: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stacks",
    reason: "Strengthen your stack fundamentals",
    url: "https://leetcode.com/problems/valid-parentheses/",
    estimatedTime: "15 min",
    concepts: ["Stack", "String"],
  },
  {
    id: 3,
    name: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Trees",
    reason: "Build on your tree knowledge",
    url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    estimatedTime: "30 min",
    concepts: ["BFS", "Queue", "Binary Tree"],
  },
]

const suggestionsVariantB = [
  {
    id: 1,
    name: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked Lists",
    reason: "You haven't practiced linked lists recently",
    url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    estimatedTime: "20 min",
    concepts: ["Linked List", "Recursion"],
  },
  {
    id: 2,
    name: "House Robber",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    reason: "Perfect intro to DP patterns",
    url: "https://leetcode.com/problems/house-robber/",
    estimatedTime: "25 min",
    concepts: ["Dynamic Programming", "Array"],
  },
  {
    id: 3,
    name: "Find All Anagrams in a String",
    difficulty: "Medium",
    topic: "Strings",
    reason: "Improve your string manipulation skills",
    url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
    estimatedTime: "35 min",
    concepts: ["Sliding Window", "Hash Table"],
  },
]

export default function SuggestionsPage() {
  const router = useRouter()
  const [currentVariant, setCurrentVariant] = useState(VARIANT_A)
  const [suggestions, setSuggestions] = useState(suggestionsVariantA)
  const [isLoading, setIsLoading] = useState(false)
  const [aiExplanation, setAiExplanation] = useState("")
  const [selectedProblem, setSelectedProblem] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/auth")
    }

    // A/B Testing: Randomly assign variant
    const variant = Math.random() > 0.5 ? VARIANT_A : VARIANT_B
    setCurrentVariant(variant)
    setSuggestions(variant === VARIANT_A ? suggestionsVariantA : suggestionsVariantB)

    // Track A/B test variant
    trackVariant(variant)
  }, [router])

  const trackVariant = async (variant: string) => {
    try {
      await fetch("/api/analytics/ab-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          variant,
          page: "suggestions",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error tracking A/B test:", error)
    }
  }

  const refreshSuggestions = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newVariant = currentVariant === VARIANT_A ? VARIANT_B : VARIANT_A
      setCurrentVariant(newVariant)
      setSuggestions(newVariant === VARIANT_A ? suggestionsVariantA : suggestionsVariantB)
      setIsLoading(false)
    }, 1000)
  }

  const getAIExplanation = async (problem: any) => {
    setSelectedProblem(problem)
    setAiExplanation("Loading explanation...")

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          problemName: problem.name,
          topic: problem.topic,
          difficulty: problem.difficulty,
          concepts: problem.concepts,
        }),
      })

      const data = await response.json()
      setAiExplanation(data.explanation)
    } catch (error) {
      setAiExplanation("Sorry, I couldn't generate an explanation right now. Please try again later.")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <Brain className="h-8 w-8 text-purple-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">AI Suggestions</span>
          </div>
          <Button onClick={refreshSuggestions} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* A/B Testing Indicator (for demo purposes) */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Personalized Recommendations</h3>
              <p className="text-sm text-blue-700">
                {currentVariant === VARIANT_A
                  ? "Based on your difficulty progression"
                  : "Based on topic gaps in your practice"}
              </p>
            </div>
            <Badge variant="outline" className="bg-white">
              Variant {currentVariant === VARIANT_A ? "A" : "B"}
            </Badge>
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {suggestions.map((problem) => (
            <Card key={problem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{problem.name}</CardTitle>
                  <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                </div>
                <CardDescription className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  {problem.topic}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{problem.reason}</p>

                <div className="flex items-center text-sm text-gray-500">
                  <Zap className="h-4 w-4 mr-1" />
                  Est. {problem.estimatedTime}
                </div>

                <div className="flex flex-wrap gap-1">
                  {problem.concepts.map((concept) => (
                    <Badge key={concept} variant="secondary" className="text-xs">
                      {concept}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button asChild size="sm" className="flex-1">
                    <a href={problem.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Solve
                    </a>
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => getAIExplanation(problem)}>
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>AI Explanation: {selectedProblem?.name}</DialogTitle>
                        <DialogDescription>Understanding the problem and approach</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="prose prose-sm max-w-none">
                          {aiExplanation.split("\n").map((paragraph, index) => (
                            <p key={index} className="mb-3">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Insights</CardTitle>
            <CardDescription>Based on your problem-solving patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Strength</h4>
                <p className="text-sm text-blue-700">Arrays & Strings</p>
                <p className="text-xs text-blue-600 mt-1">85% success rate</p>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Focus Area</h4>
                <p className="text-sm text-yellow-700">Dynamic Programming</p>
                <p className="text-xs text-yellow-600 mt-1">Need more practice</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Next Goal</h4>
                <p className="text-sm text-green-700">Graph Algorithms</p>
                <p className="text-xs text-green-600 mt-1">Ready to start</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
