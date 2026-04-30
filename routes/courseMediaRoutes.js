const express = require('express');
const router = express.Router();
const {
  createCourseMedia,
  getCourseMedias,
  getCourseMedia,
  updateCourseMedia,
  deleteCourseMedia
} = require('../controllers/courseMediaController');
const { protect, restrictTo } = require('../utils/auth');
const { validateCourseMedia, validateCourseMediaId } = require('../utils/validation');

router.post('/', protect, restrictTo('instructor', 'admin'), validateCourseMedia, createCourseMedia);
router.get('/', protect, getCourseMedias);
router.get('/:id', protect, validateCourseMediaId, getCourseMedia);
router.put('/:id', protect, restrictTo('instructor', 'admin'), validateCourseMediaId, validateCourseMedia, updateCourseMedia);
router.delete('/:id', protect, restrictTo('admin'), validateCourseMediaId, deleteCourseMedia);

module.exports = router;