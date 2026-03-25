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
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

useEffect(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER)
    if (stored) {
      setUser(JSON.parse(stored))
    }
  } catch {
    setUser(null)
  }finally {
    setIsInitialized(true) // ✅ KEY FIX
  }
}, [])
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
      document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; SameSite=Strict`

      if (data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token)
        document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=604800; SameSite=Strict`
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
      document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; SameSite=Strict`

      if (data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token)
        document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=604800; SameSite=Strict`
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
      document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; SameSite=Strict`

      if (data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token)
        document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=604800; SameSite=Strict`
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

    // Clear cookies
    document.cookie = "access_token=; path=/; max-age=0"
    document.cookie = "refresh_token=; path=/; max-age=0"

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
    isInitialized,
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