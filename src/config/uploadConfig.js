// src/config/uploadConfig.js

// Allowed file types for avatar uploads
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Maximum file size for avatar uploads (in bytes)
export const MAX_FILE_SIZE = 6 * 1024 * 1024; // 2 MB

// Image compression settings
export const COMPRESSION_OPTIONS = {
  maxSizeMB: 1, // Max file size after compression
  maxWidthOrHeight: 600, // Max width or height
  useWebWorker: true, // Use web workers for better performance
};
