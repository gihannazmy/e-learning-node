const express = require('express');
const router = express.Router();
const {
  createExamQuestion,
  getExamQuestions,
  getExamQuestion,
  updateExamQuestion,
  deleteExamQuestion
} = require('../controllers/examQuestionController');
const { protect, restrictTo } = require('../utils/auth');
const { validateExamQuestion, validateExamQuestionId } = require('../utils/validation');

router.post('/', protect, restrictTo('instructor', 'admin'), validateExamQuestion, createExamQuestion);
router.get('/', protect, getExamQuestions);
router.get('/:id', protect, validateExamQuestionId, getExamQuestion);
router.put('/:id', protect, restrictTo('instructor', 'admin'), validateExamQuestionId, validateExamQuestion, updateExamQuestion);
router.delete('/:id', protect, restrictTo('admin'), validateExamQuestionId, deleteExamQuestion);

module.exports = router;