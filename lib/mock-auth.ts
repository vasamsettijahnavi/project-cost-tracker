"use client"

import { useState, useEffect } from "react"

// Mock user type
export interface MockUser {
  id: string
  name: string
  email: string
}

// Mock user data
const MOCK_USER: MockUser = {
  id: "mock-user-1",
  name: "Demo User",
  email: "demo@example.com",
}

// Mock credentials
const MOCK_CREDENTIALS = {
  email: "demo@example.com",
  password: "password123",
}

// Local storage keys
const USER_STORAGE_KEY = "project-cost-tracker-user"

// Hook for authentication
export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      setUser(MOCK_USER)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_USER))
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  // Register function (in mock version, just logs in as demo user)
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In mock version, we'll just log in as the demo user
    setUser({ ...MOCK_USER, name: name || MOCK_USER.name, email: email || MOCK_USER.email })
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...MOCK_USER, name, email }))
    return { success: true }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return { user, loading, login, register, logout }
}
