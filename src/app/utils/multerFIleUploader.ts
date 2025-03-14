import multer from "multer";
import path from "path";
import { Request } from "express";
import { Express } from "express";

// Set allowed file types for images and audio
const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
const allowedAudioTypes = ["audio/mp3", "audio/m4a", "audio/mpeg", "audio/wav", "audio/ogg"];

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, path.join(__dirname, "../../../uploads/images")); // Images folder
    } else if (allowedAudioTypes.includes(file.mimetype)) {
      cb(null, path.join(__dirname, "../../../uploads/audio")); // Audio folder
    } else {
      cb(new Error("Unsupported file type"), ""); // Throw error for unsupported types
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter to ensure correct file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedImageTypes.includes(file.mimetype) || allowedAudioTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and audio files are allowed."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB file size limit
  },
});

// Export single file upload handlers
export const uploadSingleImage = upload.single("image"); // For uploading a single image
export const uploadSingleAudio = upload.single("audio"); // For uploading a single audio file
export const uploadMultipleIMages = upload.array("images", 6);
export const uploadImageAndAudio = upload.fields([
  { name: "image", maxCount: 1 }, // Single image field
  { name: "story", maxCount: 10 }, // Single image field
  { name: "audio", maxCount: 1 }, // Single audio field
]);