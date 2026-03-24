import { useState, useCallback } from "react"
import { getChats, createChat } from "@/services/chatService"
import { ERROR_MESSAGES, DEFAULTS } from "@/lib/constants"

/**
 
 * @returns {Object} - { conversations, fetchChats, addChat, isLoadingChats, error, setError }
 */
export function useChatSessions() {
  const [conversations, setConversations] = useState([])
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const [error, setError] = useState(null)

  const fetchChats = useCallback(async () => {
    setIsLoadingChats(true)
    try {
      const res = await getChats()
      setConversations(res || [])
      setError(null)
    } catch (err) {
      console.error("Failed to fetch chats", err)
      setError(ERROR_MESSAGES.LOAD_MESSAGES)
    } finally {
      setIsLoadingChats(false)
    }
  }, [])

  const addChat = useCallback(
    async (title = DEFAULTS.CHAT_TITLE) => {
      try {
        const newChat = await createChat(title)
        setConversations((prev) => [newChat, ...prev])
        setError(null)
        return newChat
      } catch (err) {
        console.error("Failed to create chat", err)
        setError(ERROR_MESSAGES.CREATE_CHAT)
        throw err
      }
    },
    []
  )

  return {
    conversations,
    fetchChats,
    addChat,
    isLoadingChats,
    error,
    setError,
  }
}
