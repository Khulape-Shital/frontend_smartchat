"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import ThemeProvider from "@/context/ThemeContext"
import AuthProvider from "@/context/AuthContext"
import MuiProvider from "@/components/ui/MuiProvider"
import { GOOGLE_CLIENT_ID } from "@/lib/constants"
// import { ModelProvider } from "@/context/ModelContext"
import ReduxProvider from "@/redux/ReduxProvider"

export function RootLayoutClient({ children, openSansClassName }) {
  return (
    <body className={openSansClassName}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <AuthProvider>
            <MuiProvider>
              {/* <ModelProvider>
                {children}
              </ModelProvider> */}
              <ReduxProvider>
                {children}
              </ReduxProvider>
            </MuiProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </body>
  )
}
