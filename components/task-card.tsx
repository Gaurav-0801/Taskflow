"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Task } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { toast } from "sonner"
import { motion } from "framer-motion"

const statusConfig = {
  pending: {
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    icon: Circle,
    label: "Pending",
  },
  "in-progress": {
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: PlayCircle,
    label: "In Progress",
  },
  completed: {
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: CheckCircle2,
    label: "Completed",
  },
}

const priorityConfig = {
  low: {
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    icon: Flag,
    label: "Low",
  },
  medium: {
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: Flag,
    label: "Medium",
  },
  high: {
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    icon: Flag,
    label: "High",
  },
}

interface TaskCardProps {
  task: Task
  onTaskUpdate?: () => void
}

export function TaskCard({ task, onTaskUpdate }: TaskCardProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await apiClient.delete(`/api/tasks/${task.id}`)
      toast.success("Task deleted successfully!")
      if (onTaskUpdate) {
        onTaskUpdate()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete task")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const StatusIcon = statusConfig[task.status].icon
  const PriorityIcon = priorityConfig[task.priority].icon

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card className="h-full hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-2 hover:border-primary/30 group relative overflow-hidden bg-card/95 backdrop-blur-sm">
          {/* Status indicator bar */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all ${
              task.status === "pending"
                ? "bg-yellow-500"
                : task.status === "in-progress"
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          />

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg font-semibold line-clamp-2 pr-2">
                {task.title}
              </CardTitle>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {task.description && (
              <CardDescription className="line-clamp-2 mt-2">
                {task.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`${statusConfig[task.status].color} flex items-center gap-1.5 px-2.5 py-1 font-medium shadow-sm`}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig[task.status].label}
              </Badge>
              <Badge
                variant="outline"
                className={`${priorityConfig[task.priority].color} flex items-center gap-1.5 px-2.5 py-1 font-medium shadow-sm`}
              >
                <PriorityIcon className="h-3 w-3" />
                {priorityConfig[task.priority].label}
              </Badge>
            </div>
            {task.due_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1 border-t">
                <Calendar className="h-4 w-4" />
                <span>
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <EditTaskDialog
        task={task}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onTaskUpdate={onTaskUpdate}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task "{task.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
