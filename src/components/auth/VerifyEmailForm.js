"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import { ROUTES } from "@/lib/constants"
import apiClient from "@/services/apiClient"
import styles from "./LoginForm.module.css"

export default function VerifyEmailForm({ token }) {
  const router = useRouter()
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link: no token provided")
      return
    }

    const verifyEmail = async () => {
      try {
        console.log("Verifying token:", token)
        const response = await apiClient.post("/v1/auth/verify-email", {
          token: token,
        })

        setStatus("success")
        setMessage(response.data.message || "Email verified successfully!")

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(ROUTES.LOGIN)
        }, 3000)
      } catch (err) {
        console.error("Verification error:", err)
        setStatus("error")
        setMessage(
          err.response?.data?.detail ||
            err.message ||
            "Failed to verify email. The link may have expired or the server is not responding."
        )
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Email Verification
          </Typography>

          {status === "loading" && (
            <div align="center" style={{ padding: "20px" }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Verifying your email...
              </Typography>
            </div>
          )}

          {status === "success" && (
            <>
              <div align="center" style={{ padding: "20px" }}>
                <CheckCircleIcon
                  sx={{ fontSize: 48, color: "success.main", mb: 2 }}
                />
              </div>
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Redirecting to login in 3 seconds...
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => router.push(ROUTES.LOGIN)}
                sx={{ mt: 2 }}
              >
                Go to Login Now
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div align="center" style={{ padding: "20px" }}>
                <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
              </div>
              <Alert severity="error" sx={{ mb: 2 }}>
                {message}
              </Alert>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                If your link has expired, you can request a new verification
                email.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => router.push(ROUTES.REGISTER)}
                sx={{ mt: 2 }}
              >
                Back to Register
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => router.push(ROUTES.LOGIN)}
                sx={{ mt: 1 }}
              >
                Go to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
