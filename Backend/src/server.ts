// src/server.ts

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { createTablesIfNotExists } from "./data/createTableIfNotExists.js";
import routes from "./routes/index.js";
import trashoutActivityLogs from "./jobs/trashoutActivityLogs.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import listenForNewInvoices from "./services/listenForNewInvoices.js";

import { ActivityLogService } from "./services/activityLogService.js";
import pool from "./db/pool.js";
import { createActivityLogger } from "./middlewares/activityLogMiddleware.js";

const activityLogService = new ActivityLogService(pool);

const logActivity = createActivityLogger(activityLogService);

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3001;
const HOST = process.env.HOST || "localhost";

app.use(helmet());

// Middleware - Plugins
app.use(
  cors({
    origin: [`http://${HOST}:${FRONTEND_PORT}`],
    credentials: true,
  })
);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Middleware - File Upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  "/invoices",
  express.static(path.join(__dirname, "../public/invoices"))
);

// Middleware - Cookies
app.use(cookieParser());

// Ensuring tables exist before server starts
createTablesIfNotExists();

listenForNewInvoices();

// Middleware - Logging
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the subscription management app!",
    status: "success",
    error: false
  });
});

//API routes
app.use("/api", routes);

// Middleware - Custom Error Handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Serving on "http://${HOST}:${PORT}"`);
});
