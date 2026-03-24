import { GoogleOAuthProvider } from "@react-oauth/google"
import ThemeProvider from "@/context/ThemeContext"
import AuthProvider from "@/context/AuthContext"
import MuiProvider from "@/components/ui/MuiProvider"
import { GOOGLE_CLIENT_ID, APP_NAME } from "@/lib/constants"
import { Open_Sans } from "next/font/google"
import { RootLayoutClient } from "./layout-client"
import "./globals.css"

// ✅ Use Next.js font optimization (replaces <link>)
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

// ✅ Use metadata instead of <title>
export const metadata = {
  title: APP_NAME,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
      </head>

      <RootLayoutClient openSansClassName={openSans.className}>
        {children}
      </RootLayoutClient>
    </html>
  )
}