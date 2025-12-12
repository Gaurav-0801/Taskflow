"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Shield,
  Zap,
  Database,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { Logo } from "@/components/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <header className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <Logo size="md" showText animated />
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="shadow-lg">
                <Link href="/signup">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 py-20 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-8 mb-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-tight"
          >
            Manage Your Tasks
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              With Confidence
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
          >
            A modern, full-stack task management application built with Next.js,
            TypeScript, and PostgreSQL.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-4 justify-center pt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild className="gap-2 shadow-xl">
                <Link href="/signup">
                  Start Free <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          {[
            {
              icon: Shield,
              title: "Secure Authentication",
              description:
                "Built with bcrypt password hashing and JWT token management.",
              delay: 0.7,
            },
            {
              icon: Zap,
              title: "Fast & Responsive",
              description:
                "Server-side rendering with Next.js for optimal performance.",
              delay: 0.8,
            },
            {
              icon: Database,
              title: "Scalable Database",
              description:
                "PostgreSQL with Neon for reliable data persistence.",
              delay: 0.9,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-card/90 backdrop-blur-md p-8 rounded-2xl border-2 hover:border-primary/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/10"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-7 w-7 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="border-t mt-20 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <p className="text-center text-muted-foreground">
            Built as an internship assignment demonstrating full-stack
            development skills.
          </p>
        </div>
      </footer>
    </div>
  )
}
