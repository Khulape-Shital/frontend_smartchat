"use client"

import { createTheme } from "@mui/material/styles"
import { brandColors, lightTheme as lightThemeTokens, darkTheme as darkThemeTokens } from "./tokens"

 
// ── Light theme ───────────────────────────────────────────────────────────
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brandColors.main,
      dark: brandColors.dark,
      light: brandColors.light,
    },
    background: {
      default: "#f8fafc",
      paper:   "#ffffff",
    },
    text: {
      primary:   lightThemeTokens.text.primary,
      secondary: lightThemeTokens.text.secondary,
      disabled:  lightThemeTokens.text.muted,
    },
    divider: "#3d6191",
    error: {
      main: lightThemeTokens.general.error,
    },
    success: {
      main: "#22c55e",
    },
  },
  typography: {
    fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "#f8fafc",
            transition: "background 0.2s, box-shadow 0.2s",
            "&.Mui-focused": {
              background: "#f0f6ff",
              "& fieldset": { borderColor: brandColors.main },
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, variant: "contained" },
      styleOverrides: {
        containedPrimary: {
          background: `linear-gradient(145deg, #1e3a8a 0%, ${brandColors.main} 60%, ${brandColors.light} 100%)`,
          boxShadow: `0 4px 14px rgba(${brandColors.main === "#2563eb" ? "37,99,235" : "59,130,246"},0.35)`,
          "&:hover": {
            background: `linear-gradient(145deg, #1e3a8a 0%, ${brandColors.dark} 60%, ${brandColors.main} 100%)`,
            boxShadow: `0 6px 20px rgba(${brandColors.main === "#2563eb" ? "37,99,235" : "59,130,246"},0.4)`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'Open Sans', sans-serif" },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
})

// ── Dark theme ────────────────────────────────────────────────────────────
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main:  brandColors.light,
      dark:  brandColors.main,
      light: brandColors.accent,
    },
    background: {
      default: darkThemeTokens.general.bg,
      paper:   "#161b22",
    },
    text: {
      primary:   darkThemeTokens.text.primary,
      secondary: darkThemeTokens.text.secondary,
      disabled:  "#c5d1e1",
    },
    divider: darkThemeTokens.general.border,
    error: {
      main: darkThemeTokens.general.error,
    },
    success: {
      main: "#3fb950",
    },
  },
  typography: {
    fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "#21262d",
            transition: "background 0.2s, box-shadow 0.2s",
            "&.Mui-focused": {
              background: "#262d36",
              "& fieldset": { borderColor: "#3b82f6" },
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, variant: "contained" },
      styleOverrides: {
        containedPrimary: {
          background: `linear-gradient(145deg, #1e3a8a 0%, ${brandColors.light} 60%, ${brandColors.accent} 100%)`,
          boxShadow: darkThemeTokens.buttons.shadow,
          "&:hover": {
            background: `linear-gradient(145deg, #1e3a8a 0%, ${brandColors.main} 60%, ${brandColors.light} 100%)`,
            boxShadow: "0 6px 20px rgba(59,130,246,0.45)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
})
