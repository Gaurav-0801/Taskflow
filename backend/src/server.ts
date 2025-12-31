import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"
import authRoutes from "./routes/auth.routes"
import tasksRoutes from "./routes/tasks.routes"
import profileRoutes from "./routes/profile.routes"
import { errorHandler } from "./middleware/error.middleware"

// Load .env file from the backend root directory (one level up from src/)
// When running with ts-node-dev, __dirname will be backend/src/
// So we go up one level to find backend/.env
const envPath = path.resolve(__dirname, "../.env")
console.log("\n🔍 Environment Configuration Check:")
console.log("📁 Looking for .env file at:", envPath)
console.log("📁 File exists:", require("fs").existsSync(envPath))

const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error("❌ Error loading .env file:", result.error.message)
  console.log("⚠️  Will use environment variables from process.env or defaults")
} else {
  console.log("✅ Environment variables loaded successfully!")
  console.log("📁 Loaded from:", envPath)
  if (result.parsed) {
    console.log("📝 Number of variables loaded from .env:", Object.keys(result.parsed).length)
  }
}

console.log("\n🔑 Environment Variables Status:")
console.log("   - PORT:", process.env.PORT || "not set (using default: 3001)")
console.log("   - DATABASE_URL:", process.env.DATABASE_URL 
  ? `✓ set (${process.env.DATABASE_URL.substring(0, 30)}...)` 
  : "✗ not set")
console.log("   - JWT_SECRET:", process.env.JWT_SECRET 
  ? `✓ set (length: ${process.env.JWT_SECRET.length} chars)` 
  : "✗ not set")
console.log("   - CORS_ORIGIN:", process.env.CORS_ORIGIN || "not set (using default: http://localhost:3000)")
console.log("   - NODE_ENV:", process.env.NODE_ENV || "not set")

// Also check if variables are coming from process.env (system environment)
const envVarsFromSystem = ["PORT", "DATABASE_URL", "JWT_SECRET", "CORS_ORIGIN", "NODE_ENV"]
  .filter(key => process.env[key] && !result.parsed?.[key])
if (envVarsFromSystem.length > 0) {
  console.log("ℹ️  Some variables are set from system environment (not .env file):", envVarsFromSystem.join(", "))
}
console.log("")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000"
// Support multiple origins (comma-separated) for flexibility
const corsOrigins = corsOrigin.split(",").map(o => o.trim()).filter(Boolean)

console.log("🌐 CORS Configuration:")
console.log("   - Allowed Origins:", corsOrigins.join(", "))

// Helper function to normalize URLs for comparison
const normalizeUrl = (url: string): string => {
  return url
    .replace(/\/$/, "") // Remove trailing slash
    .toLowerCase() // Case-insensitive comparison
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true)
      }
      
      // Build allowed origins list
      const allowedOrigins = [
        ...corsOrigins,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ]
      
      // Normalize both the request origin and allowed origins for comparison
      const normalizedOrigin = normalizeUrl(origin)
      const normalizedAllowed = allowedOrigins.map(normalizeUrl)
      
      if (normalizedAllowed.includes(normalizedOrigin)) {
        console.log(`✅ CORS: Allowing request from origin: ${origin}`)
        callback(null, true)
      } else {
        console.log(`❌ CORS: Blocking request from origin: ${origin}`)
        console.log(`   Allowed origins: ${allowedOrigins.join(", ")}`)
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // 24 hours
  })
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", tasksRoutes)
app.use("/api/profile", profileRoutes)

// Health check
app.get("/health", (req: express.Request, res: express.Response): void => {
  res.json({ status: "ok" })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

