// =========================================================
 ;
// ── App ────────────────────────────────────────────────────────────────────
export const APP_NAME = "SmartChat";
export const APP_TAGLINE = "Your AI companion, always ready to help.";
export const APP_VERSION = "1.0.0";

// ── API ────────────────────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
export const AUTH_API_URL = `${API_BASE_URL}/v1/auth`;
export const CHAT_API_URL = `${API_BASE_URL}/v1/chat`;

// ── Routes ─────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  CHAT: "/chat",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
};

// ── Local-storage keys ─────────────────────────────────────────────────────
 
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN:"refresh_token",
  USER: "user",
  THEME: "theme",
};

// ── Default values ─────────────────────────────────────────────────────────
export const DEFAULTS = {
  CHAT_TITLE: "New Chat",
  THEME: "light",
  GOOGLE_BUTTON_WIDTH: "400",
};

// ── Auth page copy ──────────────────────────────────────────────────────────
export const AUTH_COPY = {
  LOGIN: {
    HERO_TITLE: "Your AI companion,\nalways ready to help.",
    HERO_SUBTITLE:
      "Sign in and pick up right where you left off. Your conversations, your intelligence.",
    FORM_TITLE: "Welcome back",
    FORM_SUBTITLE: "Sign in to your SmartChat account",
    SUBMIT_BTN: "Sign In",
    SUBMIT_LOADING: "Signing in…",
    FOOTER_TEXT: "Don't have an account?",
    FOOTER_LINK: "Create one",
    FOOTER_HREF: "/auth/register",
    DIVIDER: "or continue with",
  },
  REGISTER: {
    HERO_TITLE: "The future of conversation\nstarts here.",
    HERO_SUBTITLE:
      "Create your account and unlock the power of AI-driven conversations smarter, faster, always on.",
    FORM_TITLE: "Create account",
    FORM_SUBTITLE: "Start chatting with SmartChat AI",
    SUBMIT_BTN: "Create Account",
    SUBMIT_LOADING: "Creating account…",
    FOOTER_TEXT: "Already have an account?",
    FOOTER_LINK: "Sign in",
    FOOTER_HREF: "/auth/login",
    DIVIDER: "or sign up with",
    TERMS_TEXT: "I agree to the",
    TERMS_LINK1: "Terms of Service",
    TERMS_LINK2: "Privacy Policy",
  },
  BADGE: "End-to-end encrypted conversations",
};

// ── Validation messages ─────────────────────────────────────────────────────
export const VALIDATION = {
  NAME_REQUIRED: "Full name is required",
  NAME_MIN_LENGTH: "Name must be at least 2 characters",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Enter a valid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  PASSWORD_UPPERCASE: "Must contain at least one uppercase letter",
  PASSWORD_NUMBER: "Must contain at least one number",
  CONFIRM_REQUIRED: "Please confirm your password",
  CONFIRM_MISMATCH: "Passwords do not match",
  TERMS_REQUIRED: "You must accept the terms to continue",
};

// ── Error messages ──────────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  REGISTER_FAILED: "Registration failed. Please try again.",
  LOAD_MESSAGES: "Failed to load messages.",
  CREATE_CHAT: "Failed to create chat. Please try again.",
  SEND_FAILED: "Something went wrong. Please try again.",
  LOAD_CHATS: "Failed to load chats",
  DELETE_CHAT: "Failed to delete chat",
  RENAME_CHAT: "Failed to rename chat",
  GOOGLE_LOGIN: "Google login failed",
  FEEDBACK_FAILED: "Failed to set feedback",
};

// ── Chat empty-state suggestions ────────────────────────────────────────────
export const CHAT_SUGGESTIONS = [
  { label: "💡 Explain a concept", key: "explain",   prompt: "Can you explain how [topic] works in simple terms?" },
  { label: "✍️ Help me write",     key: "write",     prompt: "Help me write a professional email about [topic]." },
  { label: "🔍 Summarize text",    key: "summarize", prompt: "Please summarize the following text:\n\n[paste your text here]" },
  { label: "💻 Debug my code",     key: "debug",     prompt: "I have a bug in my code. Here is the error message and code:\n\n[paste error and code here]" },
];

export const EMPTY_STATE = {
  TITLE: `Welcome to ${APP_NAME}`,
  SUBTITLE: "Your AI companion ask anything, get instant answers.",
};

// ── Chat input ──────────────────────────────────────────────────────────────
export const CHAT_INPUT = {
  PLACEHOLDER: "Message SmartChat…",
  SEND_LABEL: "Send message",
  ATTACH_LABEL: "Attach file",
  FILE_REMOVE: "Remove file",
  VOICE_LABEL: "Voice input",
  VOICE_STOP: "Stop listening",
};

// ── Sidebar ─────────────────────────────────────────────────────────────────
export const SIDEBAR = {
  NEW_CHAT_LABEL: "New Chat",
  RECENT_LABEL: "Recent Conversations",
  LOGOUT_LABEL: "Logout",
  RENAME_HINT: "Double-click to rename",
  SAVE_LABEL: "Save",
  CANCEL_LABEL: "Cancel",
  FREE_PLAN: "Free Plan",
};

// ── Theme ───────────────────────────────────────────────────────────────────
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
};

// ── Google OAuth ────────────────────────────────────────────────────────────
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

// ── App metadata ────────────────────────────────────────────────────────────
export const APP_META = {
  TITLE: APP_NAME,
  DESCRIPTION: "AI-powered chat application",
};
