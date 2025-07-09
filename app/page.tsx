"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, TrendingUp, Brain, Target, Zap, BarChart3 } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    }
  }, [router])

  const handleGetStarted = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DSA Tracker Pro</span>
          </div>
          <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Data Structures & Algorithms
            <span className="text-blue-600 block">Track Your Progress Like a Pro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate platform to track your DSA journey, get AI-powered insights, and accelerate your coding
            interview preparation with smart recommendations.
          </p>
          <Button onClick={handleGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
            Start Tracking Now
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track solved problems by topic and difficulty with beautiful visualizations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get AI-powered explanations and personalized problem recommendations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Smart Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Receive targeted practice suggestions based on your weak areas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>LeetCode Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Auto-sync your submissions and track progress across platforms</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Comprehensive analytics with performance graphs and insights</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>Topic Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Organize problems by topics like Arrays, Trees, DP, and more</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your DSA Skills?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who are already tracking their progress
          </p>
          <Button onClick={handleGetStarted} size="lg" variant="secondary" className="text-lg px-8 py-3">
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-6 w-6" />
            <span className="text-xl font-bold">DSA Tracker Pro</span>
          </div>
          <p className="text-gray-400">© 2024 DSA Tracker Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
