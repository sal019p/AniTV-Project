/**
 * Simple logger utility for the application
 */

// Log levels
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

// Logger configuration
const config = {
  enabled: process.env.NODE_ENV !== "production",
  level: LogLevel.INFO,
}

// Helper to check if logging is enabled for a specific level
const shouldLog = (level: LogLevel): boolean => {
  if (!config.enabled) return false

  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
  const configLevelIndex = levels.indexOf(config.level)
  const currentLevelIndex = levels.indexOf(level)

  return currentLevelIndex >= configLevelIndex
}

// Logger methods
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },

  info: (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.INFO)) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },

  error: (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, ...args)
    }
  },
}

export default logger
