import axios from "axios"
import { API_BASE_URL, AUTH_API_URL } from "@/lib/constants"

// ✅ Helper: normalize all errors
const normalizeError = (err) => {
  return {
    message:
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong",
    status: err?.response?.status || 500,
    raw: err,
  }
}

/*
Register new user
*/
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, data)
    return response.data
  } catch (err) {
    throw normalizeError(err) // ✅ consistent error
  }
}

/*
Login user
*/
export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, data)
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}

/*
Google login
*/
export const googleLogin = async (token) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/google`, { token })
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}

/*
Refresh token API
*/
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/refresh`, {
      refresh_token: refreshToken,
    })
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}



 
// export const verifyEmail = async(token)=>{
//   try{
//     const response = await axios.post(`${API_BASE_URL}/`,{token})
//     return response.data
//   }catch(err){
//     throw normalizeError(err)
//   }
// }


// Forgot password - send reset link to email
 
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/forgot-password`, { email })
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}

/*
Reset password with token
*/
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/reset-password/${token}`, { password })
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}

// Export all functions as authService object
export const authService = {
  registerUser,
  loginUser,
  googleLogin,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
}