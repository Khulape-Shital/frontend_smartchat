"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import styles from "./messageBubble.module.css";
import { setMessageFeedback, editMessageStream } from "@/services/chatService";
import { ERROR_MESSAGES } from "@/lib/constants";

export default function MessageBubble({ message, onMessageUpdate, isEditing, onStartEdit, onCancelEdit, editingMessageId, onStreamUpdate }) {
  const isUser = message.role === "user";
  const [feedback, setFeedback] = useState(message.feedback || null);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedAI, setCopiedAI] = useState(false);
  
  const [editText, setEditText] = useState(message.message || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
  if (!isEditing) {
    setEditText(message.message || "")
  }
}, [message.message, isEditing])
  const handleCopy = (text, type) => {
 
    navigator.clipboard.writeText(text);

    navigator.clipboard.writeText(text).catch((err) => {
  console.error("Copy failed", err);
});
    if (type === "user") {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else {
      setCopiedAI(true);
      setTimeout(() => setCopiedAI(false), 2000);
    }
  };

  const handleFeedback = async (feedbackType) => {
    try {
      const newFeedback = feedback === feedbackType ? null : feedbackType;
      await setMessageFeedback(message.id, newFeedback);
      setFeedback(newFeedback);
    } catch (err) {
      console.error(ERROR_MESSAGES.FEEDBACK_FAILED, err);
    }
  };

  const handleEdit = () => {
    setEditText(message.message || "");
    onStartEdit?.();
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;

    setIsSaving(true);

    let accumulatedResponse = "";

    try {
      await editMessageStream(
        message.id,
        editText.trim(),
        // onChunk - stream updates
        (chunk) => {
          accumulatedResponse += chunk;
          onStreamUpdate?.(message.id, editText.trim(), accumulatedResponse);
        },
        // onDone - finalize
        (messageId) => {
          onMessageUpdate?.();
          setIsSaving(false);
        },
        // onError
        (error) => {
          console.error("Failed to edit message", error);
          setIsSaving(false);
        }
      );
    } catch (error) {
      console.error("Edit message error:", error);
      setIsSaving(false);
    }
  };
    const handleEditChange = (e) => {
  setEditText(e.target.value);

  // reset height
  e.target.style.height = "auto";

  // set new height based on content
  e.target.style.height = e.target.scrollHeight + "px";
};

  const handleCancelEditLocal = () => {
    setEditText(message.message || "");
    onCancelEdit?.();
  };

 
  if (!message  ) {
    return null;
  }

  return (
    <div className={styles.conversationContainer}>
      {/* User Message - only render if role is user */}
      {isUser && (
        <div className={`${styles.messageWrapper} ${styles.userWrapper}`}>
          <div className={`${styles.bubble} ${styles.userBubble}`}>
            {isEditing ? (
              <div className={styles.editContainer}>
                <textarea
                  className={styles.editInput}
                  value={editText}
                  onChange={handleEditChange}
                  disabled={isSaving}
                  autoFocus
                />
                <div className={styles.editActions}>
                  <Tooltip title="Send">
                    <span>
                      <IconButton
                        className={`${styles.editBtn} ${styles.saveBtn}`}
                        onClick={handleSaveEdit}
                        disabled={isSaving || !editText.trim()}
                      >
                        {isSaving ? "..." : <SendIcon sx={{ fontSize: 25 }} />}
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton
                      className={`${styles.editBtn} ${styles.cancelBtn}`}
                      onClick={handleCancelEditLocal}
                      disabled={isSaving}
                    >
                      <CloseIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <>
                {/* File Preview */}
                {message.file && (
                  <div className={styles.filePreviewContainer}>
                    {message.file_type?.startsWith('image/') ? (
                      <img 
                        src={message.file} 
                        alt={message.file_name || 'Uploaded image'}
                        className={styles.previewImage}
                      />
                    ) : (
                      <div className={styles.fileIcon}>
                        <DescriptionIcon sx={{ fontSize: 40 }} />
                        <span className={styles.fileName}>{message.file_name}</span>
                      </div>
                    )}
                  </div>
                )}
                <p className={styles.userText}>{message.message}</p>
                <div className={styles.actions}>
                  <Tooltip title="Copy">
                    <IconButton
                      className={styles.actionBtn}
                      size="small"
                      onClick={() => handleCopy(message.message, "user")}
                    >
                      {copiedUser ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <span>
                      <IconButton
                        className={styles.actionBtn}
                        size="small"
                        onClick={handleEdit}
                        disabled={editingMessageId !== null && editingMessageId !== message.id}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI Response - show if ai_response exists */}
      {message.ai_response && (
        <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
          <div className={`${styles.bubble} ${styles.aiBubble}`}>
            <div className={styles.aiText}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.ai_response}
              </ReactMarkdown>
            </div>
            <div className={styles.actions}>
              <Tooltip title="Copy">
                <IconButton
                  className={styles.actionBtn}
                  size="small"
                  onClick={() => handleCopy(message.ai_response, "ai")}
                >
                  {copiedAI ? <CheckIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Like">
                <IconButton
                  className={`${styles.actionBtn} ${feedback === "like" ? styles.active : ""}`}
                  size="small"
                  onClick={() => handleFeedback("like")}
                >
                  <ThumbUpIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dislike">
                <IconButton
                  className={`${styles.actionBtn} ${feedback === "dislike" ? styles.active : ""}`}
                  size="small"
                  onClick={() => handleFeedback("dislike")}
                >
                  <ThumbDownIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
