 "use client"

import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material"
import { useTheme } from "@/context/ThemeContext"
import { lightTheme, darkTheme } from "@/lib/muiTheme"

export default function MuiProvider({ children }) {
  const { theme } = useTheme()
  const muiTheme = theme === "dark" ? darkTheme : lightTheme

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
