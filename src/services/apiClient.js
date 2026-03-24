import axios from "axios"
import { STORAGE_KEYS, ROUTES, API_BASE_URL, AUTH_API_URL } from "@/lib/constants"

 

const getStorageItem = (key) => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(key)
}

// ✅ helper: clear auth + redirect (centralized)
const clearAuthAndRedirect = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)

  window.location.href = ROUTES.LOGIN
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
 
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  const queue = failedQueue
  failedQueue = []
  isRefreshing = false

  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        
        if (!refreshToken) {
          // No refresh token available - clear auth and redirect to login
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
           
    
          
          window.location.href = ROUTES.LOGIN
          return Promise.reject(error)
        }

        const response = await axios.post(`${AUTH_API_URL}/refresh`, {
          refresh_token: refreshToken
        })

        const newToken = response.data.access_token
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken)
        
        // Update the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        
        processQueue(null, newToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
     
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        sessionStorage.removeItem('auth_complete')
        
        processQueue(refreshError, null)
        window.location.href = ROUTES.LOGIN
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Request interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient