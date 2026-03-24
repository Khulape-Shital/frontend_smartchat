import apiClient from "./apiClient"
import { API_BASE_URL, CHAT_API_URL, STORAGE_KEYS, DEFAULTS } from "@/lib/constants"

// ── Helper: Auth Fetch (always uses latest token) ─────────────────────────────

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })
}

// ── Chat Sessions ────────────────────────────────────────────────────────────

export const getChats = async () => {
  const res = await apiClient.get(`${CHAT_API_URL}/chats`)
  return res.data
}

export const createChat = async (title = DEFAULTS.CHAT_TITLE) => {
  const res = await apiClient.post(`${CHAT_API_URL}/chats`, { title })
  return res.data
}

export const updateChatTitle = async (chatId, title) => {
  const res = await apiClient.put(`${CHAT_API_URL}/chats/${chatId}`, { title })
  return res.data
}

export const deleteChat = async (chatId) => {
  const res = await apiClient.delete(`${CHAT_API_URL}/chats/${chatId}`)
  // 204 No Content has no response body, just return success
  // return res.status === 204 ? { success: true } : res.data
  return

}

// ── Messages ─────────────────────────────────────────────────────────────────

export const getMessages = async (chatId) => {
  const res = await apiClient.get(`${CHAT_API_URL}/chats/${chatId}/messages`)
  return res.data
}

// ── Streaming: Send Message ──────────────────────────────────────────────────

export const sendMessageStream = async (
  chatId,
  message,
  file,
  onChunk,
  onDone,
  onError
) => {
  try {
    let body
    let headers = {}

    if (file) {
      const formData = new FormData()
      formData.append("message", message)
      formData.append("file", file)
      body = formData
    } else {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify({ message })
    }

    const response = await authFetch(
      `${CHAT_API_URL}/chats/${chatId}/messages`,
      {
        method: "POST",
        headers,
        body,
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error("Response body is empty")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (!line.trim().startsWith("data: ")) continue

        try {
          const jsonStr = line.slice(line.indexOf("data: ") + 6).trim()
          if (!jsonStr) continue

          const data = JSON.parse(jsonStr)

          if (data.type === "chunk" && data.text) {
            onChunk?.(data.text)
          } else if (data.type === "done" && data.message_id) {
            onDone?.(data.message_id)
          } else if (data.type === "error") {
            onError?.(data.error || "Unknown error")
          }
        } catch (err) {
          console.error("Stream parse error:", err, "on line:", line)
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim().startsWith("data: ")) {
      try {
        const jsonStr = buffer.slice(buffer.indexOf("data: ") + 6).trim()
        if (jsonStr) {
          const data = JSON.parse(jsonStr)
          if (data.type === "done" && data.message_id) {
            onDone?.(data.message_id)
          } else if (data.type === "error") {
            onError?.(data.error || "Unknown error")
          }
        }
      } catch (err) {
        console.error("Stream final buffer parse error:", err)
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Stream failed"
    onError?.(errorMsg)
  }
}

// ── Streaming: Edit Message ──────────────────────────────────────────────────

export const editMessageStream = async (
  messageId,
  message,
  onChunk,
  onDone,
  onError
) => {
  try {
    const response = await authFetch(
      `${CHAT_API_URL}/messages/${messageId}/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error("Response body is empty")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (!line.trim().startsWith("data: ")) continue

        try {
          const jsonStr = line.slice(line.indexOf("data: ") + 6).trim()
          if (!jsonStr) continue

          const data = JSON.parse(jsonStr)

          if (data.type === "chunk" && data.text) {
            onChunk?.(data.text)
          } else if (data.type === "done" && data.message_id) {
            onDone?.(data.message_id)
          } else if (data.type === "error") {
            onError?.(data.error || "Unknown error")
          }
        } catch (err) {
          console.error("Stream parse error:", err, "on line:", line)
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim().startsWith("data: ")) {
      try {
        const jsonStr = buffer.slice(buffer.indexOf("data: ") + 6).trim()
        if (jsonStr) {
          const data = JSON.parse(jsonStr)
          if (data.type === "done" && data.message_id) {
            onDone?.(data.message_id)
          } else if (data.type === "error") {
            onError?.(data.error || "Unknown error")
          }
        }
      } catch (err) {
        console.error("Stream final buffer parse error:", err)
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Stream failed"
    onError?.(errorMsg)
  }
}

// ── Message Feedback & Editing ──────────────────────────────────────────────

export const setMessageFeedback = async (messageId, feedback) => {
  const res = await apiClient.post(`${CHAT_API_URL}/messages/${messageId}/feedback`, { feedback })
  return res.data
}

export const editMessage = async (messageId, message) => {
  const res = await apiClient.put(`${CHAT_API_URL}/messages/${messageId}/edit`, { message })
  return res.data
}