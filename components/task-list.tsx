"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { Task } from "@/types"
import { TaskCard } from "@/components/task-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate?: () => void
}

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<
    "all" | "pending" | "in-progress" | "completed"
  >("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((task) => task.status === filter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description &&
            task.description.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [tasks, filter, searchQuery])

  const getStatusCount = (status: string) => {
    return tasks.filter((t) => t.status === status).length
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
              {tasks.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
              {getStatusCount("pending")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
              {getStatusCount("in-progress")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
              {getStatusCount("completed")}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task Grid */}
      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {searchQuery || filter !== "all"
                    ? "No tasks found"
                    : "No tasks yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery || filter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first task to get started!"}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tasks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskCard task={task} onTaskUpdate={onTaskUpdate} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
