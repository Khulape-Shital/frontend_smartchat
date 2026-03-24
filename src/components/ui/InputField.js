"use client"

import { useState } from "react"
import PropTypes from "prop-types" // ✅ added
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

export default function InputField({
  id,
  label,
  type = "text",
  icon: Icon,
  error,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  // ✅ runtime safety check
  const isValidIcon = typeof Icon === "function"

  return (
    <TextField
      id={id}
      label={label}
      type={inputType}
      error={!!error}
      helperText={error || " "}
      fullWidth
      className={className}
      InputLabelProps={{ shrink: true }}
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "var(--bg-input, #f8fafc)",
          color: "var(--text-dark, #0f172a)",
          "&.Mui-focused": {
            backgroundColor: "var(--bg-input-focus, #f0f6ff)",
          },
        },
        "& .MuiOutlinedInput-input::placeholder": {
          color: "var(--text-secondary, #94a3b8)",
          opacity: 1,
        },
        "& .MuiInputLabel-root": {
          color: "var(--text-secondary, #475569)",
        },
      }}
      slotProps={{
        input: {
          // ✅ safe rendering
          startAdornment: isValidIcon ? (
            <InputAdornment position="start">
              <Icon sx={{ fontSize: 18, color: "text.disabled" }} />
            </InputAdornment>
          ) : undefined,

          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <VisibilityOffIcon sx={{ fontSize: 18 }} />
                ) : (
                  <VisibilityIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
        htmlInput: {
          "aria-invalid": !!error,
          "aria-describedby": error ? `${id}-error` : undefined,
        },
      }}
      {...props}
    />
  )
}

// ✅ PropTypes added (main fix)
InputField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.elementType, // ✅ ensures it's a component
  error: PropTypes.string,
  className: PropTypes.string,
}