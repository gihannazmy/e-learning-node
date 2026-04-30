const CourseMedia = require('../models/CourseMedia');
const AppError = require('../utils/AppError');
const fs = require('fs').promises;
const path = require('path');
const config = require('../utils/config');

// Helper function to delete file from filesystem
const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Create course media with file upload
exports.createCourseMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    const mediaData = {
      courseId: req.body.courseId,
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      path: req.file.path,
      url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      size: req.file.size,
      fileSize: req.file.size,
      uploadedBy: req.user._id
    };

    // Add optional fields
    if (req.body.duration) {
      mediaData.duration = parseInt(req.body.duration);
    }

    if (req.body.order) {
      mediaData.order = parseInt(req.body.order);
    }

    const courseMedia = await CourseMedia.create(mediaData);

    res.status(201).json({
      status: 'success',
      data: {
        courseMedia
      }
    });
  } catch (error) {
    // If there's an error and file was uploaded, delete it
    if (req.file && req.file.path) {
      await deleteFile(req.file.path);
    }

    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all course media with filtering and pagination
exports.getCourseMedias = async (req, res) => {
  try {
    const { courseId, type, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (type) filter.type = type;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { order: 1, createdAt: -1 },
      populate: [
        { path: 'courseId', select: 'title description' },
        { path: 'uploadedBy', select: 'name email' }
      ]
    };

    const result = await CourseMedia.paginate(filter, options);

    res.json({
      status: 'success',
      results: result.docs.length,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalResults: result.totalDocs
      },
      data: {
        courseMedias: result.docs
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single course media
exports.getCourseMedia = async (req, res) => {
  try {
    const courseMedia = await CourseMedia.findById(req.params.id)
      .populate('courseId', 'title description')
      .populate('uploadedBy', 'name email');

    if (!courseMedia) {
      return res.status(404).json({
        status: 'error',
        message: 'Course media not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        courseMedia
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update course media
exports.updateCourseMedia = async (req, res) => {
  try {
    const updateData = {};

    // Only allow updating certain fields
    const allowedFields = ['title', 'description', 'order'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const courseMedia = await CourseMedia.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('courseId', 'title description')
    .populate('uploadedBy', 'name email');

    if (!courseMedia) {
      return res.status(404).json({
        status: 'error',
        message: 'Course media not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        courseMedia
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete course media
exports.deleteCourseMedia = async (req, res) => {
  try {
    const courseMedia = await CourseMedia.findById(req.params.id);

    if (!courseMedia) {
      return res.status(404).json({
        status: 'error',
        message: 'Course media not found'
      });
    }

    // Delete the file from filesystem
    await deleteFile(courseMedia.path);

    // Delete from database
    await CourseMedia.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Course media deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Stream media file (for video/audio streaming)
exports.streamMedia = async (req, res) => {
  try {
    const courseMedia = await CourseMedia.findById(req.params.id);

    if (!courseMedia) {
      return res.status(404).json({
        status: 'error',
        message: 'Media file not found'
      });
    }

    const filePath = path.join(process.cwd(), courseMedia.path);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found on server'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', courseMedia.mimeType);
    res.setHeader('Content-Length', courseMedia.size);
    res.setHeader('Accept-Ranges', 'bytes');

    // Handle range requests for video streaming
    const range = req.headers.range;
    if (range && courseMedia.type === 'video') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : courseMedia.size - 1;
      const chunksize = (end - start) + 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${courseMedia.size}`);
      res.setHeader('Content-Length', chunksize);

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      // Regular file download
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get media statistics
exports.getMediaStats = async (req, res) => {
  try {
    const stats = await CourseMedia.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalSize: { $sum: '$fileSize' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalStats = await CourseMedia.aggregate([
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$fileSize' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        byType: stats,
        overall: totalStats[0] || { totalFiles: 0, totalSize: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};