const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface RequestOptions extends RequestInit {
  body?: any
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  private setAuthToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("auth_token", token)
  }

  private clearAuthToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("auth_token")
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { body, ...fetchOptions } = options

    const url = `${this.baseUrl}${endpoint}`
    const token = this.getAuthToken()
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    }

    // Add Authorization header if token exists (for cross-origin requests)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
      credentials: "include", // Include cookies (fallback for same-origin)
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "An error occurred",
        }))
        throw new Error(error.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // If this is a sign-in/sign-up response and contains a token, store it
      if (data.token && typeof data.token === "string") {
        this.setAuthToken(data.token)
      }
      
      return data
    } catch (error: any) {
      if (error.message) {
        throw error
      }
      throw new Error("Network error. Please try again.")
    }
  }

  // Method to clear auth token (for sign out)
  clearAuth(): void {
    this.clearAuthToken()
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body })
  }

  async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

