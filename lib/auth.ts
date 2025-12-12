import { apiClient } from "./api-client"
import { verifyToken as verifyJWT } from "jose"
import type { User } from "@/types"

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    const verified = await verifyJWT(token, SECRET_KEY)
    return verified.payload as { userId: number }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get<{ user: User }>("/api/auth/me")
    return response.user
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}
