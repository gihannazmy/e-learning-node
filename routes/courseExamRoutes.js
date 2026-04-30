const express = require('express');
const router = express.Router();
const {
  createCourseExam,
  getCourseExams,
  getCourseExam,
  updateCourseExam,
  deleteCourseExam
} = require('../controllers/courseExamController');
const { protect, restrictTo } = require('../utils/auth');
const { validateExam, validateExamId } = require('../utils/validation');

router.post('/', protect, restrictTo('instructor', 'admin'), validateExam, createCourseExam);
router.get('/', protect, getCourseExams);
router.get('/:id', protect, validateExamId, getCourseExam);
router.put('/:id', protect, restrictTo('instructor', 'admin'), validateExamId, validateExam, updateCourseExam);
router.delete('/:id', protect, restrictTo('admin'), validateExamId, deleteCourseExam);

module.exports = router;