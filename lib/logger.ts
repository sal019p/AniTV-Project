// Log levels
type LogLevel = "debug" | "info" | "warn" | "error"

// Enable or disable logging based on environment
const isLoggingEnabled = process.env.NODE_ENV !== "production"

// Colors for different log levels
const logColors = {
  debug: "#7986cb", // blue
  info: "#4caf50", // green
  warn: "#ff9800", // orange
  error: "#f44336", // red
}

/**
 * Logger utility for consistent logging across the application
 */
export const logger = {
  debug: (message: string, data?: any) => {
    logMessage("debug", message, data)
  },

  info: (message: string, data?: any) => {
    logMessage("info", message, data)
  },

  warn: (message: string, data?: any) => {
    logMessage("warn", message, data)
  },

  error: (message: string, data?: any) => {
    logMessage("error", message, data)
  },

  // Log data flow events specifically
  dataFlow: (action: string, data?: any) => {
    logMessage("info", `[DataFlow] ${action}`, data)
  },
}

/**
 * Internal function to handle the actual logging
 */
function logMessage(level: LogLevel, message: string, data?: any) {
  if (!isLoggingEnabled) return

  const timestamp = new Date().toISOString()
  const color = logColors[level]

  // Format: [LEVEL] [Timestamp] Message
  const formattedMessage = `%c[${level.toUpperCase()}] [${timestamp}] ${message}`

  switch (level) {
    case "debug":
      console.debug(formattedMessage, `color: ${color}; font-weight: bold`)
      break
    case "info":
      console.info(formattedMessage, `color: ${color}; font-weight: bold`)
      break
    case "warn":
      console.warn(formattedMessage, `color: ${color}; font-weight: bold`)
      break
    case "error":
      console.error(formattedMessage, `color: ${color}; font-weight: bold`)
      break
  }

  // Log additional data if provided
  if (data) {
    console.log("%cData:", "font-weight: bold", data)
  }
}
