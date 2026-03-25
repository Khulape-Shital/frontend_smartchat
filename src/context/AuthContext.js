"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { registerUser, loginUser, googleLogin } from "@/services/authService"
import { STORAGE_KEYS, ROUTES } from "@/lib/constants"

const AuthContext = createContext(undefined)

export default function AuthProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ FIX 1: Add reactive user state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const isAuthenticated = !!user

  // ✅ FIX 2: Clear error on route change
  useEffect(() => {
    setError(null)
  }, [pathname])

  // ✅ LOGIN
  const login = useCallback(async (credentials) => {
    setIsLoading(true)
    setError(null)
    
  sessionStorage.removeItem("auth_complete") 

    try {
      const data = await loginUser(credentials)

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token)

      if (data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token)
      }

      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
        setUser(data.user) // ✅ important for reactivity
      }

      return data
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || err.message || "Login failed"
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ REGISTER
  const register = useCallback(async (userData) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await registerUser(userData)

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token)

      if (data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token)
      }

      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
        setUser(data.user) // ✅ important
      }

      return data
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Registration failed"
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ GOOGLE LOGIN (used by GoogleLoginButton)
  const googleAuthLogin = useCallback(async (token) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await googleLogin(token)

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token)

      if (data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token)
      }

      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
        setUser(data.user) // ✅ important
      }

      return data
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Google login failed"
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ LOGOUT (centralized + redirect)
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)

    setUser(null)
    setError(null)

    router.replace(ROUTES.LOGIN) // ✅ FIX
  }, [router])

  const value = {
    user,                // ✅ exposed
    isAuthenticated,     // ✅ exposed
    login,
    register,
    googleAuthLogin,
    logout,
    isLoading,
    error,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}