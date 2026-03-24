"use client"

import MuiButton from "@mui/material/Button"

export default function Button({
  type = "button",
  children,
  onClick,
  className = "",
  style = {},
  disabled = false,
  variant,
  sx,
  ...props
}) {
  return (
    <MuiButton
      type={type}
      onClick={onClick}
      className={className}
      style={style}
      disabled={disabled}
      variant={variant}
      sx={sx}
      {...props}
    >
      {children}
    </MuiButton>
  )
}
