"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";
import InputField from "../ui/InputField";
import {
  validateEmail,
  validatePassword,
  getErrorMessage,
} from "@/lib/validators";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import ChatIcon from "@mui/icons-material/Chat";
import {
  AUTH_COPY,
  STORAGE_KEYS,
  ROUTES,
  ERROR_MESSAGES,
  APP_NAME,
} from "@/lib/constants";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error: authError, isAuthenticated, isInitialized  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(
    localStorage.getItem("remember_me") === "true",
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
  if (!isInitialized) return

  if (isAuthenticated) {
    router.replace(ROUTES.CHAT)
  }
}, [isAuthenticated, isInitialized, router])

  const validate = () => {
    const e = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    try {
      await login({ email, password, remember });
      // Mark authentication as complete to allow redirect
      sessionStorage.setItem("auth_complete", "true");
      router.replace(ROUTES.CHAT);
    } catch (err) {
      const errorMsg =
        getErrorMessage(err?.response?.data) ||
        authError ||
        ERROR_MESSAGES.LOGIN_FAILED;
      setServerError(errorMsg);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* ---- Left blue panel ---- */}
        <div className={styles.left}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <ChatIcon sx={{ fontSize: 18, color: "#fff" }} />
            </div>
            <span className={styles.brandName}>{APP_NAME}</span>
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {AUTH_COPY.LOGIN.HERO_TITLE.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <p className={styles.heroSubtitle}>
              {AUTH_COPY.LOGIN.HERO_SUBTITLE}
            </p>
          </div>

          {/* <div className={styles.badge}>
            <SecurityIcon sx={{ fontSize: 13 }} />
            {AUTH_COPY.BADGE}
          </div> */}
        </div>

        {/* ---- Right form panel ---- */}
        <div className={styles.right}>
          <div className={styles.formInner}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>{AUTH_COPY.LOGIN.FORM_TITLE}</h2>
              <p className={styles.formSubtitle}>
                {AUTH_COPY.LOGIN.FORM_SUBTITLE}
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {serverError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {serverError}
                </Alert>
              )}

              <InputField
                id="email"
                label="Email address"
                type="email"
                icon={EmailIcon}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                autoComplete="email"
              />

              <InputField
                id="password"
                label="Password"
                type="password"
                icon={LockIcon}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
              />

              
              <div className={styles.rememberRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={remember}
                      onChange={(e) => {
                        setRemember(e.target.checked);
                        localStorage.setItem("remember_me", e.target.checked);
                      }}
                    />
                  }
                  label="Remember me"
                  className={styles.rememberLabel}
                />
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className={styles.forgotLink}
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                className={styles.submitBtn}
              >
                {isLoading
                  ? AUTH_COPY.LOGIN.SUBMIT_LOADING
                  : AUTH_COPY.LOGIN.SUBMIT_BTN}
              </Button>
            </form>

            <p className={styles.footer}>
              {AUTH_COPY.LOGIN.FOOTER_TEXT}
              <Link
                href={AUTH_COPY.LOGIN.FOOTER_HREF}
                className={styles.footerLink}
              >
                {AUTH_COPY.LOGIN.FOOTER_LINK}
              </Link>
            </p>

            <div className={styles.divider}>{AUTH_COPY.LOGIN.DIVIDER}</div>

            <div className={styles.socialCol}>
              <GoogleLoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
