"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import ThemeProvider from "@/context/ThemeContext"
import AuthProvider from "@/context/AuthContext"
import MuiProvider from "@/components/ui/MuiProvider"
import { GOOGLE_CLIENT_ID } from "@/lib/constants"

export function RootLayoutClient({ children, openSansClassName }) {
  return (
    <body className={openSansClassName}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <AuthProvider>
            <MuiProvider>
              {children}
            </MuiProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </body>
  )
}
