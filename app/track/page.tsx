"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Code, Plus, CheckCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

const topics = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Sorting",
  "Searching",
  "Hash Tables",
  "Stacks & Queues",
]

const difficulties = ["Easy", "Medium", "Hard"]

export default function TrackPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [topicProgress, setTopicProgress] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    difficulty: "",
    platform: "",
    timeSpent: "",
    notes: "",
    solution: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/auth")
      return
    }
    fetchTopicProgress(token)
  }, [router])

  const fetchTopicProgress = async (token: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTopicProgress(data.topicDistribution)
      }
    } catch (error) {
      console.error("Error fetching topic progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          difficulty: formData.difficulty,
          platform: formData.platform,
          timeSpent: parseInt(formData.timeSpent) || 0,
          notes: formData.notes,
          solution: formData.solution,
        }),
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({
          title: "",
          category: "",
          difficulty: "",
          platform: "",
          timeSpent: "",
          notes: "",
          solution: "",
        })
        
        // Refresh topic progress
        const token = localStorage.getItem("auth_token")
        if (token) {
          await fetchTopicProgress(token)
        }
        
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        console.error("Error submitting problem:", errorData)
      }
    } catch (error) {
      console.error("Error submitting problem:", error)
    } finally {
      setIsSubmitting(false)
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
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <Code className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">Track Problems</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Problem
                </CardTitle>
                <CardDescription>Track your latest problem-solving achievement</CardDescription>
              </CardHeader>
              <CardContent>
                {showSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800">Problem tracked successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Problem Name *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Two Sum"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Input
                        id="platform"
                        placeholder="e.g., LeetCode, HackerRank"
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Topic *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty *</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map((difficulty) => (
                            <SelectItem key={difficulty} value={difficulty}>
                              {difficulty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
                    <Input
                      id="timeSpent"
                      type="number"
                      placeholder="e.g., 45"
                      value={formData.timeSpent}
                      onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Your thoughts, approach, or key insights..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solution">Solution (Optional)</Label>
                    <Textarea
                      id="solution"
                      placeholder="Your solution approach or code..."
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Tracking Problem...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Track Problem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Topic Progress</CardTitle>
                <CardDescription>Your progress by category</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading progress...</span>
                  </div>
                ) : Object.keys(topicProgress).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(topicProgress).map(([topic, count]) => (
                      <div key={topic} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{topic}</span>
                          <Badge variant="secondary">{count as number} solved</Badge>
                        </div>
                        <Progress value={(count as number) * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No problems tracked yet.</p>
                    <p className="text-xs mt-1">Start solving problems to see your progress!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
                <CardDescription>Make the most of your tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Be consistent with your difficulty ratings
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Add notes to remember your approach
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Track time spent to improve efficiency
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
