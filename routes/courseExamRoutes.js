const express = require('express');
const router = express.Router();
const {
  createCourseExam,
  getCourseExams,
  getCourseExam,
  updateCourseExam,
  deleteCourseExam
} = require('../controllers/courseExamController');

router.post('/', createCourseExam);
router.get('/', getCourseExams);
router.get('/:id', getCourseExam);
router.put('/:id', updateCourseExam);
router.delete('/:id', deleteCourseExam);

module.exports = router;