const express = require('express');
const router = express.Router();
const {
  createStudentCourse,
  getStudentCourses,
  getStudentCourse,
  updateStudentCourse,
  deleteStudentCourse
} = require('../controllers/studentCourseController');
const { protect, restrictTo } = require('../utils/auth');
const { validateStudentCourse, validateStudentCourseId } = require('../utils/validation');

router.post('/', protect, validateStudentCourse, createStudentCourse);
router.get('/', protect, getStudentCourses);
router.get('/:id', protect, validateStudentCourseId, getStudentCourse);
router.put('/:id', protect, validateStudentCourseId, validateStudentCourse, updateStudentCourse);
router.delete('/:id', protect, restrictTo('admin'), validateStudentCourseId, deleteStudentCourse);

module.exports = router;