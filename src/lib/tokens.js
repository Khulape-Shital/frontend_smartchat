 

// ── Brand Colors ──────────────────────────────────────────────────────────
export const brandColors = {
  main: "#2563eb",
  dark: "#1d4ed8",
  light: "#3b82f6",
  accent: "#60a5fa",
  accentSidebar: "#3b82f6",
}

// ── Light Theme ───────────────────────────────────────────────────────────
export const lightTheme = {
  brand: {
    main: "#2563eb",
    rgb: "37, 99, 235",
    gradient: "linear-gradient(135deg, #5273b6 0%, #5572c1 100%)",
    accentSidebar: "#55709c",
  },
  sidebar: {
    bg: "#f8fafc",
    bgHover: "#e2e8f0",
    bgActive: "#f1f5f9",
    text: "#475569",
    textActive: "#1e293b",
    border: "#e2e8f0",
    borderInner: "#cbd5e1",
  },
  chatInput: {
    bg: "#ffffff",
    border: "#cbd5e1",
    placeholder: "#9ca3af",
  },
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    muted: "#9ca3af",
  },
  general: {
    bg: "#f3f4f6",
    border: "#e5e7eb",
    error: "#dc2626",
    shadowInput: "0 0 0 3px rgba(37, 99, 235, 0.1)",
  },
  bubble: {
    ai: {
      bg: "#bbc5d3",
      text: "#0f3f5c",
    },
  },
  buttons: {
    shadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  },
  utilities: {
    radiusSm: "6px",
  },
}

// ── Dark Theme ────────────────────────────────────────────────────────────
export const darkTheme = {
  brand: {
    main: "#2563eb",
    rgb: "37, 99, 235",
    gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    accentSidebar: "#3b82f6",
  },
  sidebar: {
    bg: "#1e293b",
    bgHover: "#334155",
    bgActive: "#0f172a",
    text: "#cbd5e1",
    textActive: "#f1f5f9",
    border: "#334155",
    borderInner: "#475569",
  },
  chatInput: {
    bg: "#1e293b",
    border: "#ffffff",
    placeholder: "#94a3b8",
  },
  text: {
    primary: "#f1f5f9",
    secondary: "#cbd5e1",
    muted: "#64748b",
  },
  general: {
    bg: "#334155",
    border: "#475569",
    error: "#ef4444",
    shadowInput: "0 0 0 3px rgba(37, 99, 235, 0.2)",
  },
  bubble: {
    ai: {
      bg: "#2c415c",
      text: "#dbeafe",
    },
  },
  buttons: {
    shadow: "0 4px 14px rgba(59,130,246,0.4)",
  },
  utilities: {
    radiusSm: "6px",
  },
}

/**
 
 * @param {Object} themeTokens - Theme tokens object (lightTheme or darkTheme)
 * @param {string} selector - CSS selector for the variables (e.g., ':root' or '[data-theme="dark"]')
 * @returns {string} CSS custom property declarations
 */
export function generateCSSVariables(themeTokens, selector = ":root") {
  let css = `${selector} {\n`
  
  // Brand colors
  css += `  /* Brand Colors */\n`
  css += `  --brand: ${themeTokens.brand.main};\n`
  css += `  --brand-rgb: ${themeTokens.brand.rgb};\n`
  css += `  --brand-gradient: ${themeTokens.brand.gradient};\n`
  css += `  --accent-sidebar: ${themeTokens.brand.accentSidebar};\n\n`
  
  // Sidebar
  css += `  /* Sidebar */\n`
  css += `  --bg-sidebar: ${themeTokens.sidebar.bg};\n`
  css += `  --bg-sidebar-hover: ${themeTokens.sidebar.bgHover};\n`
  css += `  --bg-sidebar-active: ${themeTokens.sidebar.bgActive};\n`
  css += `  --text-sidebar: ${themeTokens.sidebar.text};\n`
  css += `  --text-sidebar-active: ${themeTokens.sidebar.textActive};\n`
  css += `  --border-sidebar: ${themeTokens.sidebar.border};\n`
  css += `  --border-sidebar-inner: ${themeTokens.sidebar.borderInner};\n\n`
  
  // Chat Input
  css += `  /* Chat Input */\n`
  css += `  --bg-chat-input-wrap: ${themeTokens.chatInput.bg};\n`
  css += `  --border-chat: ${themeTokens.chatInput.border};\n`
  css += `  --input-placeholder: ${themeTokens.chatInput.placeholder};\n\n`
  
  // Text
  css += `  /* Text */\n`
  css += `  --text-primary: ${themeTokens.text.primary};\n`
  css += `  --text-secondary: ${themeTokens.text.secondary};\n`
  css += `  --text-muted: ${themeTokens.text.muted};\n\n`
  
  // General
  css += `  /* General */\n`
  css += `  --bg-input: ${themeTokens.general.bg};\n`
  css += `  --border: ${themeTokens.general.border};\n`
  css += `  --error: ${themeTokens.general.error};\n`
  css += `  --shadow-input: ${themeTokens.general.shadowInput};\n\n`
  
  // AI Bubble
  css += `  /* AI Bubble */\n`
  css += `  --bg-bubble-ai: ${themeTokens.bubble.ai.bg};\n`
  css += `  --text-bubble-ai: ${themeTokens.bubble.ai.text};\n\n`
  
  // Buttons & Shadows
  css += `  /* Buttons & Shadows */\n`
  css += `  --shadow-btn: ${themeTokens.buttons.shadow};\n\n`
  
  // Utilities
  css += `  /* Utilities */\n`
  css += `  --radius-sm: ${themeTokens.utilities.radiusSm};\n`
  css += `}\n`
  
  return css
}
