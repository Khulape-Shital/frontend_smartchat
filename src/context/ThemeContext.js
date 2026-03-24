"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { STORAGE_KEYS, DEFAULTS, THEME_MODES } from "@/lib/constants"

// ✅ fallback safety if constants missing
const LIGHT = THEME_MODES?.LIGHT || "light"
const DARK = THEME_MODES?.DARK || "dark"

const ThemeContext = createContext({
  theme: DEFAULTS.THEME,
  toggleTheme: () => {},
})

export default function ThemeProvider({ children }) {
  // ✅ initialize from localStorage immediately
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return DEFAULTS.THEME
    return localStorage.getItem(STORAGE_KEYS.THEME) || DEFAULTS.THEME
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // ✅ ensure DOM sync
    document.documentElement.setAttribute("data-theme", theme)
    setMounted(true)
  }, [theme])

  const toggleTheme = () => {
    const next = theme === LIGHT ? DARK : LIGHT

    setTheme(next)
    localStorage.setItem(STORAGE_KEYS.THEME, next)
    document.documentElement.setAttribute("data-theme", next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* ✅ prevent UI flicker */}
      {mounted ? children : null}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}