const express = require('express');
const router = express.Router();
const {
  createStudentCourse,
  getStudentCourses,
  getStudentCourse,
  updateStudentCourse,
  deleteStudentCourse
} = require('../controllers/studentCourseController');

router.post('/', createStudentCourse);
router.get('/', getStudentCourses);
router.get('/:id', getStudentCourse);
router.put('/:id', updateStudentCourse);
router.delete('/:id', deleteStudentCourse);

module.exports = router;