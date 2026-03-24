import { useState, useEffect } from "react"
import { getMessages } from "@/services/chatService"
import { ERROR_MESSAGES } from "@/lib/constants"

/**
 
 * @param {string|null} chatId - The ID of the currently selected chat
 * @returns {Object} - { messages, setMessages, isLoading, error, setError, reload }
 */
export function useChatMessages(chatId) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const reload = async () => {
    if (!chatId) {
      setMessages([])
      return
    }

    setIsLoading(true)
    try {
      const res = await getMessages(chatId)
      setMessages(res || [])
      setError(null)
    } catch (err) {
      console.error("Failed to load messages", err)
      setError(ERROR_MESSAGES.LOAD_MESSAGES)
    } finally {
      setIsLoading(false)
    }
  }

  // Load messages when chatId changes
  useEffect(() => {
    reload()
  }, [chatId])

  return {
    messages,
    setMessages,
    isLoading,
    error,
    setError,
    reload,
  }
}
