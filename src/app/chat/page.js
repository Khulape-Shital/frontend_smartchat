"use client"

import styles from "./chat.module.css"
import Sidebar from "@/components/sidebar/sidebar"
import ChatInput from "@/components/TextField/ChatInput"
import MessageBubble from "@/components/messages/messageBubble"
import ThemeToggle from "@/components/ui/ThemeToggle"
import { useState, useEffect, useRef, useCallback } from "react"
import { sendMessageStream, editMessageStream, deleteChat } from "@/services/chatService"
import { useRouter } from "next/navigation"
import MenuIcon from "@mui/icons-material/Menu"
import ChatIcon from "@mui/icons-material/Chat"
import { STORAGE_KEYS, ROUTES, ERROR_MESSAGES, EMPTY_STATE, CHAT_SUGGESTIONS, DEFAULTS, APP_NAME } from "@/lib/constants"
import { useChatMessages } from "@/hooks/useChatMessages"
import { useChatSessions } from "@/hooks/useChatSessions"
 

export default function ChatPage() {
  const [open, setOpen] = useState(true)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [suggestionText, setSuggestionText] = useState("")
  const messagesEndRef = useRef(null)
  const scrollThresholdRef = useRef(150) // pixels from bottom to trigger auto-scroll
  const streamUpdateTimeoutRef = useRef(null)

  // Custom hooks for managing messages and sessions
  const { messages, setMessages, error: msgError, setError: setMsgError, reload: reloadMessages } = useChatMessages(selectedChatId)
  const { conversations, fetchChats, addChat, error: sessionError } = useChatSessions()

  const error = msgError || sessionError
  const router = useRouter()

  // Auth guard with middleware (see middleware.js)
  // This is kept as a fallback for client-side verification
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    console.log(token);
    
    if (!token) {
      sessionStorage.removeItem('auth_complete')
      router.push(ROUTES.LOGIN)
    }
  }, [router])

  // Smart auto-scroll: only auto-scroll if user is already near the bottom
  const autoScroll = useCallback(() => {
    const messagesContainer = messagesEndRef.current?.parentElement
    if (!messagesContainer) return

    const { scrollTop, clientHeight, scrollHeight } = messagesContainer
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - scrollThresholdRef.current

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    autoScroll()
  }, [messages, isLoading, autoScroll])

  const handleSelectChat = useCallback((chatId) => {
    console.log(chatId);
    
    setSelectedChatId(chatId)
    setMsgError(null)
  }, [setMsgError])

  const handleNewChat = useCallback((chatId) => {
    if (chatId) {
      setSelectedChatId(chatId)
    } else {
      setSelectedChatId(null)
    }
    setMsgError(null)
  }, [setMsgError])

  const handleSend = useCallback(async (msg) => {
    if (!msg.text?.trim() && !msg.file) return

    // Create a new chat if none is selected (first message)
    let chatId = selectedChatId
    let isNewChat = false
    if (!chatId) {
      try {
        const newChat = await addChat(DEFAULTS.CHAT_TITLE)
        chatId = newChat.id
        isNewChat = true
        // Callback pattern: no need for manual refreshSidebar counter
      } catch (err) {
        console.error("Failed to create new chat", err)
        setMsgError(ERROR_MESSAGES.CREATE_CHAT)
        return
      }
    }

    // Add temporary message with loading state
    const tempId = `temp-${Date.now()}`
    console.log(tempId);
    
    const userMsg = {
      id: tempId,
      role: "user",
      message: msg.text?.trim() || (msg.file ? `[Uploaded file: ${msg.file.name}]` : ""),
      ai_response: "",
      file: msg.file ? URL.createObjectURL(msg.file) : null,
      file_name: msg.file?.name,
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)
    setMsgError(null)

    let accumulatedResponse = ""
    let finalMessageId = null

    // Debounce streaming updates to avoid excessive re-renders
    const updateStreamedMessage = (chunk) => {
      accumulatedResponse += chunk
      
      // Clear existing timeout and set new one (debounce)
      if (streamUpdateTimeoutRef.current) {
        clearTimeout(streamUpdateTimeoutRef.current)
      }
      
      streamUpdateTimeoutRef.current = setTimeout(() => {
        setMessages((prev) =>
          prev.map(m => m.id === tempId
            ? { ...m, ai_response: accumulatedResponse }
            : m
          )
        )
      }, 50) // Update every 50ms instead of on every chunk
    }

    await sendMessageStream(
      chatId,
      msg.text?.trim() || "",
      msg.file,
      updateStreamedMessage,
      // onDone - finalize with real message ID
      (messageId) => {
        // Flush any pending debounced updates immediately
        if (streamUpdateTimeoutRef.current) {
          clearTimeout(streamUpdateTimeoutRef.current)
          // Force final update with accumulated response
          setMessages((prev) =>
            prev.map(m => m.id === tempId
              ? { ...m, ai_response: accumulatedResponse }
              : m
            )
          )
        }

        finalMessageId = messageId
        setMessages((prev) =>
          prev.map(m => m.id === tempId
            ? {
                id: messageId,
                role: "user",
                message: msg.text?.trim() || `[Uploaded file: ${msg.file?.name}]`,
                ai_response: accumulatedResponse,
                feedback: null,
                file: m.file,
                file_name: msg.file?.name,
              }
            : m
          )
        )
        setIsLoading(false)
        // Set selectedChatId after message is sent (for new chats)
        if (isNewChat) {
          setSelectedChatId(chatId)
        }
      },
      // onError
      (error) => {
        console.error("Send message failed", error)
        setMsgError(error || ERROR_MESSAGES.SEND_FAILED)
        setMessages((prev) => prev.filter(m => m.id !== tempId))
        setIsLoading(false)
      }
    )
  }, [selectedChatId, addChat, setMsgError])

  const handleMessageUpdate = useCallback(async () => {
    // Reload messages when a message is edited
    if (selectedChatId) {
      try {
        await reloadMessages()
        setEditingMessageId(null)
      } catch (err) {
        console.error("Failed to reload messages", err)
      }
    }
  }, [selectedChatId, reloadMessages])

  const handleStreamUpdate = useCallback((messageId, newMessage, newAiResponse) => {
    // Update message progressively during streaming edit
    setMessages((prev) =>
      prev.map(m =>
        m.id === messageId
          ? { ...m, message: newMessage, ai_response: newAiResponse }
          : m
      )
    )
  }, [])

  const handleStartEdit = useCallback((messageId) => {
    setEditingMessageId(messageId)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingMessageId(null)
  }, [])

  // Proper delete implementation: clear from server AND UI
  const handleClearChat = useCallback(async () => {
    if (!selectedChatId) return

    try {
      await deleteChat(selectedChatId)
      setMessages([])
      setMsgError(null)
      setSelectedChatId(null)
      // Refresh sidebar to remove deleted chat
      await fetchChats()
    } catch (err) {
      console.error("Failed to delete chat", err)
      setMsgError(ERROR_MESSAGES.CREATE_CHAT)
    }
  }, [selectedChatId, fetchChats, setMsgError])

  return (
    <div className={styles.container}>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className={`${styles.sidebarOverlay} ${styles.visible}`}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar with real data */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        selectedChatId={selectedChatId}
        onSelectChat={(id) => { handleSelectChat(id); if (window.innerWidth <= 768) setOpen(false) }}
        onNewChat={handleNewChat}
        onChatCreated={fetchChats}
      />

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {/* Chat header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            {/* Mobile hamburger — only visible on small screens via CSS */}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </button>
            <h3 className={styles.chatTitle}>
              {selectedChatId ? "Chat" : APP_NAME}
            </h3>
          </div>
          <div className={styles.headerActions}>
            {messages.length > 0 && (
              <button className={styles.clearBtn} onClick={handleClearChat}>
                Clear
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Messages list */}
        <div className={styles.messages} aria-live="polite" aria-label="Chat messages">
          {!selectedChatId && messages.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <ChatIcon sx={{ fontSize: 28, color: "#fff" }} />
              </div>
              <p className={styles.emptyTitle}>{EMPTY_STATE.TITLE}</p>
              <p className={styles.emptySubtitle}>{EMPTY_STATE.SUBTITLE}</p>
              <div className={styles.suggestionsGrid}>
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s.key}
                    className={styles.suggestionCard}
                    onClick={() => setSuggestionText(s.prompt)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              onMessageUpdate={handleMessageUpdate}
              isEditing={editingMessageId === msg.id}
              onStartEdit={() => handleStartEdit(msg.id)}
              onCancelEdit={handleCancelEdit}
              editingMessageId={editingMessageId}
              onStreamUpdate={handleStreamUpdate}
            />
          ))}

          {/* AI loading indicator */}
          {isLoading && (
            <div className={styles.loadingWrapper}>
              <div className={styles.loadingDots}>
                <span /><span /><span />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className={styles.errorMsg}>  {error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={styles.inputArea}>
          <ChatInput
            handleMessages={handleSend}
            disabled={false}
            prefillText={suggestionText}
            onPrefillConsumed={() => setSuggestionText("")}
          />
        </div>
      </div>
    </div>
  )
}
