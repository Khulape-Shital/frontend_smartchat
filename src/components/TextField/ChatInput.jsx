"use client"
import { useState, useRef, useEffect } from "react"
import SendIcon from "@mui/icons-material/Send"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Chip from "@mui/material/Chip"
import styles from "./ChatInput.module.css"
import { CHAT_INPUT } from "@/lib/constants"

export default function ChatInput({ handleMessages, disabled = false, prefillText = "", onPrefillConsumed }) {

  const [message, setMessage] = useState("")
  const [file, setFile] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const textareaRef = useRef(null)

 
  useEffect(() => {
    if (prefillText) {
      setMessage(prefillText)
      // Allow React to re-render the textarea value before measuring height
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"
          textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
          textareaRef.current.focus()
        }
      })
      onPrefillConsumed?.()
    }
  }, [prefillText, onPrefillConsumed])

  const isInputEmpty = !message.trim() && !file

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleSend = () => {
    if (isInputEmpty) return
    handleMessages({ text: message, file: file })
    setMessage("")
    setFile(null)
    resetTextareaHeight()
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = e.target.scrollHeight + "px"
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/", "text/plain", "application/pdf"]

  const uploadFile = (e) => {
   

    
    const uploadedFile = e.target.files[0]
      if (!uploadedFile) return
      if (uploadedFile.size > MAX_FILE_SIZE) {
    alert("File too large (max 10 MB)")
    e.target.value = ""
    return
  }

    const isValidType = ALLOWED_TYPES.some(type =>
    uploadedFile.type.startsWith(type)
  )

  if (!isValidType) {
    alert("Invalid file type. Only images, text, and PDFs allowed.")
    e.target.value = ""
    return
  }

  setFile(uploadedFile)
  }

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
   
      if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setMessage((prev) => (prev ? prev + " " + transcript : transcript))
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  const handleActionClick = () => {
    if (isListening) {
      toggleVoice()
    } else if (isInputEmpty) {
      toggleVoice()
    } else {
      handleSend()
    }
  }

  const actionTooltip = isListening
    ? CHAT_INPUT.VOICE_STOP
    : isInputEmpty
    ? CHAT_INPUT.VOICE_LABEL
    : CHAT_INPUT.SEND_LABEL

  return (
    <div className={styles.container}>
      <Tooltip title={CHAT_INPUT.ATTACH_LABEL}>
        <label className={styles.attachLabel}>
          <AttachFileIcon sx={{ fontSize: 30, color: file ? "primary.main" : "inherit" }} />
          
          <input
            type="file"
            accept="image/*,text/plain,application/pdf"
            onChange={uploadFile}
            style={{ display: "none" }}
          />
        </label>
      </Tooltip>

      {file && (
        <Chip
          label={file.name}
          size="small"
          className={styles.filePreview}
          onDelete={() => setFile(null)}
          deleteIcon={<CloseIcon />}
        />
      )}

      <textarea
        ref={textareaRef}
        className={styles.input}
        value={message}
        placeholder={CHAT_INPUT.PLACEHOLDER}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
      />

      <Tooltip title={actionTooltip}>
        <IconButton
          className={`${styles.button}${isListening ? ` ${styles.listening}` : ""}`}
          onClick={handleActionClick}
          disabled={disabled}
          aria-label={actionTooltip}
        >
          {isListening
            ? <MicOffIcon sx={{ fontSize: 22 }} />
            : isInputEmpty
            ? <MicIcon sx={{ fontSize: 22 }} />
            : <SendIcon sx={{ fontSize: 30 }} />}
        </IconButton>
      </Tooltip>
    </div>
  )
}
