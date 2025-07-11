// src/middlewares/upload.ts

import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/profile_pictures/");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  console.log("Received file:", file.originalname, "MIME Types:", file.mimetype);
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log("🚫 File rejected:", file.originalname, "MIME Type:", file.mimetype);
    cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."));
  }
};

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    const uniqueFileName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit 10MB
});

export default upload;
