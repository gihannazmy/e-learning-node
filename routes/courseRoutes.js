// routes/courseRoutes.js
const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../utils/auth');
const { validateCourse, validateCourseId } = require('../utils/validation');

router.post('/', protect, restrictTo('instructor', 'admin'), validateCourse, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourse);
router.put('/:id', protect, restrictTo('instructor', 'admin'), validateCourseId, validateCourse, updateCourse);
router.delete('/:id', protect, restrictTo('admin'), validateCourseId, deleteCourse);

module.exports = router;