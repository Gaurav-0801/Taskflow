"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/types"
import { LogOut, User as UserIcon, Settings } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { ProfileDialog } from "./profile-dialog"
import { motion } from "framer-motion"
import { Logo } from "@/components/logo"

export function DashboardHeader({ user }: { user: User }) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await apiClient.post("/api/auth/signout")
      toast.success("Signed out successfully")
      router.push("/login")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out")
    } finally {
      setIsSigningOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="border-b bg-card/95 backdrop-blur-md sticky top-0 z-50 shadow-lg border-border/50">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Logo size="md" animated={false} />
              <div className="hidden sm:block">
                <h2 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  TaskFlow
                </h2>
                <p className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </p>
              </div>
              <div className="sm:hidden">
                <p className="text-sm text-muted-foreground">
                  {user.name.split(" ")[0]}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </header>
      <ProfileDialog
        user={user}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </>
  )
}
