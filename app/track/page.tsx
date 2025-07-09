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
import { ArrowLeft, Code, Plus, CheckCircle } from "lucide-react"
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

const topicProgress = {
  Arrays: { solved: 25, total: 50 },
  Strings: { solved: 20, total: 40 },
  Trees: { solved: 18, total: 35 },
  "Dynamic Programming": { solved: 15, total: 45 },
  Graphs: { solved: 12, total: 30 },
  "Linked Lists": { solved: 10, total: 25 },
}

export default function TrackPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    problemName: "",
    topic: "",
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
    }
  }, [router])

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
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({
          problemName: "",
          topic: "",
          difficulty: "",
          platform: "",
          timeSpent: "",
          notes: "",
          solution: "",
        })
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error submitting problem:", error)
    } finally {
      setIsSubmitting(false)
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
                      <Label htmlFor="problemName">Problem Name *</Label>
                      <Input
                        id="problemName"
                        placeholder="e.g., Two Sum"
                        value={formData.problemName}
                        onChange={(e) => setFormData({ ...formData, problemName: e.target.value })}
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
                      <Label htmlFor="topic">Topic *</Label>
                      <Select
                        value={formData.topic}
                        onValueChange={(value) => setFormData({ ...formData, topic: value })}
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
                      placeholder="e.g., 30"
                      value={formData.timeSpent}
                      onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any insights, challenges, or key learnings..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solution">Solution (Optional)</Label>
                    <Textarea
                      id="solution"
                      placeholder="Paste your solution code here..."
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Tracking Problem..." : "Track Problem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Topic Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Topic Progress</CardTitle>
                <CardDescription>Your progress across different topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(topicProgress).map(([topic, progress]) => (
                  <div key={topic} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{topic}</span>
                      <span className="text-sm text-gray-500">
                        {progress.solved}/{progress.total}
                      </span>
                    </div>
                    <Progress value={(progress.solved / progress.total) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Problems this week:</span>
                  <Badge>12</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Current streak:</span>
                  <Badge variant="secondary">7 days</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Favorite topic:</span>
                  <Badge variant="outline">Arrays</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Average time:</span>
                  <span className="text-sm text-gray-600">25 min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
