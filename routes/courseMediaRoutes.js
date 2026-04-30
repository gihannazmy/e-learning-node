const express = require('express');
const router = express.Router();
const {
  createCourseMedia,
  getCourseMedias,
  getCourseMedia,
  updateCourseMedia,
  deleteCourseMedia,
  streamMedia,
  getMediaStats
} = require('../controllers/courseMediaController');
const { protect, restrictTo } = require('../utils/auth');
const { validateCourseMedia, validateCourseMediaId } = require('../utils/validation');
const { upload, handleUploadError } = require('../utils/fileUpload');

// Routes for course media management
router.post('/',
  protect,
  restrictTo('instructor', 'admin'),
  upload.single('file'),
  handleUploadError,
  validateCourseMedia,
  createCourseMedia
);

router.get('/', protect, getCourseMedias);
router.get('/stats', protect, restrictTo('admin'), getMediaStats);
router.get('/:id', protect, validateCourseMediaId, getCourseMedia);
router.get('/:id/stream', protect, validateCourseMediaId, streamMedia);
router.put('/:id',
  protect,
  restrictTo('instructor', 'admin'),
  validateCourseMediaId,
  validateCourseMedia,
  updateCourseMedia
);
router.delete('/:id', protect, restrictTo('admin'), validateCourseMediaId, deleteCourseMedia);

module.exports = router;