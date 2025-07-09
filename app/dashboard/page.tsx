"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, Award, Brain, Code, BarChart3, Plus, LogOut, RefreshCw } from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalProblems: 0,
    weeklyGoal: 100,
    currentStreak: 0,
    totalTopics: 0,
  })
  const [progressData, setProgressData] = useState<any[]>([])
  const [topicData, setTopicData] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/auth")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
      fetchDashboardData(token)
    }
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
        setProgressData(statsData.progressData)
        
        // Convert topic distribution to chart format
        const topicChartData = Object.entries(statsData.topicDistribution).map(([name, value]) => ({
          name,
          value,
          color: getTopicColor(name),
        }))
        setTopicData(topicChartData)
      }

      // Fetch recent activity
      const activityResponse = await fetch("/api/dashboard/recent-activity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData.recentActivity)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      setRefreshing(true)
      await fetchDashboardData(token)
      setRefreshing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const getTopicColor = (topic: string) => {
    const colors = {
      "Arrays": "#3b82f6",
      "Trees": "#10b981", 
      "Dynamic Programming": "#f59e0b",
      "Graphs": "#ef4444",
      "Strings": "#8b5cf6",
      "Others": "#6b7280",
    }
    return colors[topic as keyof typeof colors] || "#6b7280"
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Code className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DSA Tracker Pro</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProblems}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalProblems > 0 ? "+" + Math.floor(stats.totalProblems * 0.1) + " from last week" : "Start solving problems!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyGoal}</div>
              <Progress value={(stats.totalProblems / stats.weeklyGoal) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalProblems}/{stats.weeklyGoal} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
              <p className="text-xs text-muted-foreground">
                {stats.currentStreak > 0 ? "Keep it up! 🔥" : "Start your streak today!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTopics}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
              <CardDescription>Your problem-solving journey</CardDescription>
            </CardHeader>
            <CardContent>
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="problems" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <p>No data available yet. Start solving problems to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Topic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Distribution</CardTitle>
              <CardDescription>Problems solved by category</CardDescription>
            </CardHeader>
            <CardContent>
              {topicData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topicData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {topicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <p>No problems solved yet. Start tracking your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link href="/track">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-blue-600" />
                  Track New Problem
                </CardTitle>
                <CardDescription>Add a new problem you've solved</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link href="/suggestions">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Get Suggestions
                </CardTitle>
                <CardDescription>AI-powered problem recommendations</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link href="/analytics">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  View Analytics
                </CardTitle>
                <CardDescription>Detailed performance insights</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest problem-solving sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.problem}</h4>
                      <p className="text-sm text-gray-600">{activity.topic}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          activity.difficulty === "Easy"
                            ? "secondary"
                            : activity.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {activity.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity. Start solving problems to see your activity here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
