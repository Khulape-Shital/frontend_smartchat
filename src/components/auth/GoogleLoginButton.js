"use client"

import { GoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"
import { ROUTES, ERROR_MESSAGES, DEFAULTS } from "@/lib/constants"
import { useAuth } from "@/hooks/useAuth"
import styles from "./GoogleLoginButton.module.css"

export default function GoogleLoginButton() { 
  const router = useRouter()
  const { googleAuthLogin } = useAuth() // ✅ use context

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential

    try {
      // ✅ delegate to context
      await googleAuthLogin(token)

      router.replace(ROUTES.CHAT) // ✅ better than push
    } catch (error) {
      console.error(ERROR_MESSAGES.GOOGLE_LOGIN, error)
    }
  }

  return (
    <div className={styles.wrapper}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error(ERROR_MESSAGES.GOOGLE_LOGIN)}
        type="standard"
        shape="rectangular"
        theme="outline"
        size="large"
        text="continue_with"
        width={DEFAULTS.GOOGLE_BUTTON_WIDTH}
      />
    </div>
  )
}