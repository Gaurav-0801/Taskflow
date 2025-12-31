import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return verified.payload as { userId: number }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  // Note: For cross-origin setups (Vercel frontend + Render backend),
  // cookies set by the backend won't be accessible here.
  // The dashboard page handles authentication via API calls instead.

  // Redirect authenticated users away from auth pages (if token exists locally)
  if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    try {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch {
      // Token invalid, allow access to auth pages
    }
  }

  // For protected routes, let the page component handle authentication
  // This allows cross-origin cookies to work properly
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
