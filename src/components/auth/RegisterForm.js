"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import GoogleLoginButton from "./GoogleLoginButton";
import InputField from "../ui/InputField";
import Link from "next/link";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getErrorMessage,
} from "@/lib/validators";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ChatIcon from "@mui/icons-material/Chat";
import {
  AUTH_COPY,
  STORAGE_KEYS,
  ROUTES,
  ERROR_MESSAGES,
  APP_NAME,
  VALIDATION,
} from "@/lib/constants";
import styles from "./LoginForm.module.css";

export default function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error: authError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ FIX: Check BOTH storages + use replace
  useEffect(() => {
    const token =
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      router.replace(ROUTES.CHAT);
    }
  }, [router]);

  const validate = () => {
    const e = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirm),
      agreed: !agreed ? VALIDATION.TERMS_REQUIRED : "",
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validate()) return;

    try {
      await register({ name, email, password });

      // ✅ Show success message
      setSuccessMessage(
        "✓ Verification email sent! Check your inbox to verify your email.",
      );

      // ✅ Redirect to login after 2 seconds
      setTimeout(() => {
        router.replace(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      const errorMsg =
        getErrorMessage(err?.response?.data) ||
        authError ||
        ERROR_MESSAGES.REGISTER_FAILED;

      setServerError(errorMsg);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Left Panel */}
        <div className={styles.left}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <ChatIcon sx={{ fontSize: 18, color: "#fff" }} />
            </div>
            <span className={styles.brandName}>{APP_NAME}</span>
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {AUTH_COPY.REGISTER.HERO_TITLE.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <p className={styles.heroSubtitle}>
              {AUTH_COPY.REGISTER.HERO_SUBTITLE}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className={styles.right}>
          <div className={styles.formInner}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {AUTH_COPY.REGISTER.FORM_TITLE}
              </h2>
              <p className={styles.formSubtitle}>
                {AUTH_COPY.REGISTER.FORM_SUBTITLE}
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {successMessage && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 2,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #2196f3 0%, #ffffff 100%)",
                    color: "#0d47a1",
                    fontWeight: 500,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    alignItems: "center",
                  }}
                >
                  {successMessage}
                </Alert>
              )}

              {serverError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {serverError}
                </Alert>
              )}

              <InputField
                id="name"
                label="Full name"
                type="text"
                icon={PersonIcon}
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                disabled={successMessage || isLoading}
              />

              <InputField
                id="email"
                label="Email address"
                type="email"
                icon={EmailIcon}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={successMessage || isLoading}
              />

              <div className={styles.row}>
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  icon={LockIcon}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  disabled={successMessage || isLoading}
                />

                <InputField
                  id="confirm"
                  label="Confirm password"
                  type="password"
                  icon={LockIcon}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  error={errors.confirm}
                  disabled={successMessage || isLoading}
                />
              </div>

              <div className={styles.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      disabled={successMessage || isLoading}
                    />
                  }
                  label="I agree to Terms and Privacy Policy"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#333',
                    }
                  }}
                />
              </div>

              {errors.agreed && (
                <p className={styles.checkboxError}>{errors.agreed}</p>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || !!successMessage}
                className={styles.submitBtn}
              >
                {successMessage
                  ? "Redirecting to login..."
                  : isLoading
                    ? AUTH_COPY.REGISTER.SUBMIT_LOADING
                    : AUTH_COPY.REGISTER.SUBMIT_BTN}
              </Button>
            </form>

            <p className={styles.footer}>
              {AUTH_COPY.REGISTER.FOOTER_TEXT}
              <Link
                href={AUTH_COPY.REGISTER.FOOTER_HREF}
                className={styles.footerLink}
              >
                {AUTH_COPY.REGISTER.FOOTER_LINK}
              </Link>
            </p>

            <div className={styles.divider}>{AUTH_COPY.REGISTER.DIVIDER}</div>

            <div
              style={{
                opacity: successMessage ? 0.5 : 1,
                pointerEvents: successMessage ? "none" : "auto",
              }}
            >
              <GoogleLoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
