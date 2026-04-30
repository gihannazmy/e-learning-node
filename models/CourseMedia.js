const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const courseMediaSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },

  title: {
    type: String,
    required: [true, 'Media title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  type: {
    type: String,
    required: [true, 'Media type is required'],
    enum: {
      values: ['video', 'audio', 'document', 'image'],
      message: 'Type must be video, audio, document, or image'
    }
  },

  filename: {
    type: String,
    required: [true, 'Filename is required']
  },

  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },

  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },

  path: {
    type: String,
    required: [true, 'File path is required']
  },

  url: {
    type: String,
    required: [true, 'File URL is required']
  },

  size: {
    type: Number,
    required: [true, 'File size is required']
  },

  duration: {
    type: Number, // in seconds, for video/audio
    min: [1, 'Duration must be at least 1 second']
  },

  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    max: [50000000, 'File size cannot exceed 50MB'] // 50MB limit
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },

  order: {
    type: Number,
    default: 0,
    min: [0, 'Order must be a positive number']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
courseMediaSchema.index({ courseId: 1, order: 1 });
courseMediaSchema.index({ uploadedBy: 1 });

// Virtual for file size in human readable format
courseMediaSchema.virtual('fileSizeFormatted').get(function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.fileSize === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(this.fileSize) / Math.log(1024)));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Pre-remove middleware to delete file from filesystem
courseMediaSchema.pre('remove', async function(next) {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Delete the file from filesystem
    const filePath = path.join(process.cwd(), this.path);
    await fs.unlink(filePath);
    next();
  } catch (error) {
    // Log error but don't fail the removal
    console.error('Error deleting file:', error);
    next();
  }
});

// Add pagination plugin
courseMediaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CourseMedia', courseMediaSchema);