const express = require('express');
const router = express.Router();
const {
  createInstructor,
  getInstructors,
  getInstructor,
  updateInstructor,
  deleteInstructor
} = require('../controllers/instructorController');
const { protect, restrictTo } = require('../utils/auth');
const { validateInstructor, validateInstructorId } = require('../utils/validation');

router.post('/', protect, restrictTo('admin'), validateInstructor, createInstructor);
router.get('/', getInstructors);
router.get('/:id', validateInstructorId, getInstructor);
router.put('/:id', protect, restrictTo('admin'), validateInstructorId, validateInstructor, updateInstructor);
router.delete('/:id', protect, restrictTo('admin'), validateInstructorId, deleteInstructor);

module.exports = router;