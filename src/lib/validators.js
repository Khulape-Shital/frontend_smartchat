import { VALIDATION } from "./constants"

export const validateName = (name) => {
  if (!name.trim()) return VALIDATION.NAME_REQUIRED
  if (name.trim().length < 2) return VALIDATION.NAME_MIN_LENGTH
  return ""
}

export const validateEmail = (email) => {
  if (!email.trim()) return VALIDATION.EMAIL_REQUIRED
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) return VALIDATION.EMAIL_INVALID
  return ""
}

export const validatePassword = (password) => {
  if (!password) return VALIDATION.PASSWORD_REQUIRED
  if (password.length < 8) return VALIDATION.PASSWORD_MIN_LENGTH
  if (!/[A-Z]/.test(password)) return VALIDATION.PASSWORD_UPPERCASE
  if (!/[0-9]/.test(password)) return VALIDATION.PASSWORD_NUMBER
   
  return ""
}

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return VALIDATION.CONFIRM_REQUIRED
  if (password !== confirm) return VALIDATION.CONFIRM_MISMATCH
  return ""
}
 
export const getErrorMessage = (error) => {
  // If it's a string, return as-is
  if (typeof error === "string") return error

  // If it's an object with a detail property
  if (error?.detail) {
    // If detail is a string, return it
    if (typeof error.detail === "string") return error.detail
    // If detail is an array of validation errors, extract messages
    if (Array.isArray(error.detail)) {
      return error.detail.map((err) => err.msg || JSON.stringify(err)).join("; ")
    }
    // If detail is an object, try to get msg property
    if (error.detail.msg) return error.detail.msg
  }

  // If it's a validation error object directly
  if (error?.msg) return error.msg

  // Default fallback
  return JSON.stringify(error)
}
