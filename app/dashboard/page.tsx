"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskList } from "@/components/task-list"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { apiClient } from "@/lib/api-client"
import type { Task, User } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const tasksResponse = await apiClient.get<{ tasks: Task[] }>("/api/tasks")
      setTasks(tasksResponse.tasks)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [userResponse, tasksResponse] = await Promise.all([
          apiClient.get<{ user: User }>("/api/auth/me"),
          apiClient.get<{ tasks: Task[] }>("/api/tasks"),
        ])
        setUser(userResponse.user)
        setTasks(tasksResponse.tasks)
      } catch (error) {
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your tasks efficiently
            </p>
          </div>
          <CreateTaskDialog onTaskCreated={fetchTasks} />
        </div>
        <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
      </main>
    </div>
  )
}
