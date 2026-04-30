const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../utils/config');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), config.fileUpload.path);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.fileUpload.path);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    'video': ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'],
    'audio': ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/ogg'],
    'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  };

  // Get media type from request body or determine from file type
  const mediaType = req.body.type;

  if (!mediaType || !allowedTypes[mediaType]) {
    return cb(new Error(`Invalid media type: ${mediaType}. Must be video, audio, document, or image`), false);
  }

  if (!allowedTypes[mediaType].includes(file.mimetype)) {
    return cb(new Error(`File type ${file.mimetype} not allowed for ${mediaType} uploads`), false);
  }

  cb(null, true);
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.fileUpload.maxSize, // 5MB default
    files: 1 // Only one file per request
  }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: `File too large. Maximum size allowed is ${config.fileUpload.maxSize / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files uploaded'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected file field'
      });
    }
  }

  if (error.message.includes('Invalid media type') || error.message.includes('File type')) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }

  next(error);
};

module.exports = {
  upload,
  fileFilter,
  handleUploadError
};