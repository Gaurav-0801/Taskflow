"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  showText?: boolean
}

const sizeMap = {
  sm: { icon: 20, text: "text-lg", container: "h-8 w-8" },
  md: { icon: 24, text: "text-xl", container: "h-10 w-10" },
  lg: { icon: 32, text: "text-2xl", container: "h-14 w-14" },
  xl: { icon: 40, text: "text-3xl", container: "h-16 w-16" },
}

export function Logo({
  className,
  size = "md",
  animated = true,
  showText = false,
}: LogoProps) {
  const sizes = sizeMap[size]

  const logoContent = (
    <div className={cn("flex items-center gap-3", className)}>
      <motion.div
        initial={animated ? { scale: 0, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: animated ? 0.1 : 0,
        }}
        className={cn(
          "rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-lg",
          sizes.container
        )}
      >
        <svg
          width={sizes.icon}
          height={sizes.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground"
        >
          {/* Task Flow Icon - Stylized TF with flowing lines */}
          <motion.path
            initial={animated ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: animated ? 0.3 : 0 }}
            d="M12 8L12 40M12 8L28 8M12 8L8 12M28 8L32 12M28 8L28 24M28 24L40 24M28 24L24 28M40 24L40 40M40 24L44 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="text-white"
          />
          {/* Checkmark accent */}
          <motion.circle
            initial={animated ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ delay: animated ? 0.6 : 0, type: "spring" }}
            cx="36"
            cy="36"
            r="6"
            fill="currentColor"
            className="text-white/90"
          />
          <motion.path
            initial={animated ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: animated ? 0.8 : 0 }}
            d="M33 36L35 38L39 34"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      {showText && (
        <motion.span
          initial={animated ? { opacity: 0, x: -10 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: animated ? 0.4 : 0 }}
          className={cn(
            "font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",
            sizes.text
          )}
        >
          TaskFlow
        </motion.span>
      )}
    </div>
  )

  return logoContent
}

