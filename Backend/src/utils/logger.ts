// src/utils/logger.ts

import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, prettyPrint } = format;
import path from "path";
import { fileURLToPath } from "url";

// Resolve the directory path dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log file path inside the `src` folder
const logFilePath = path.join(__dirname, "..", "app.log");

// Custom format for console logging with colors and emojis
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    let emoji = "";
    switch (level) {
      case "info":
        emoji = "ℹ️";
        break;
      case "error":
        emoji = "❌";
        break;
      case "warn":
        emoji = "⚠️";
        break;
      default:
        emoji = "🔍";
    }
    return `${emoji} [${timestamp}] ${level}: ${message}`;
  })
);

// Custom format for file logging (pretty-printed JSON)
const fileLogFormat = format.combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Custom timestamp format
  format.prettyPrint({ colorize: false, depth: 4 }) // Pretty-print JSON with indentation
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()), // Default format for all transports
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({
      filename: logFilePath,
      format: fileLogFormat, // Apply pretty-print format to file logs
    }),
  ],
});

export default logger;