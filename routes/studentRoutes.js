const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, restrictTo } = require('../utils/auth');
const { validateStudent, validateStudentId } = require('../utils/validation');

router.post('/', protect, restrictTo('admin'), validateStudent, createStudent);
router.get('/', protect, restrictTo('admin', 'instructor'), getStudents);
router.get('/:id', protect, validateStudentId, getStudent);
router.put('/:id', protect, restrictTo('admin'), validateStudentId, validateStudent, updateStudent);
router.delete('/:id', protect, restrictTo('admin'), validateStudentId, deleteStudent);

module.exports = router;