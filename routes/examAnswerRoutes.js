const express = require('express');
const router = express.Router();
const {
  createExamAnswer,
  getExamAnswers,
  getExamAnswer,
  updateExamAnswer,
  deleteExamAnswer
} = require('../controllers/examAnswerController');
const { protect, restrictTo } = require('../utils/auth');
const { validateExamAnswer, validateExamAnswerId } = require('../utils/validation');

router.post('/', protect, validateExamAnswer, createExamAnswer);
router.get('/', protect, getExamAnswers);
router.get('/:id', protect, validateExamAnswerId, getExamAnswer);
router.put('/:id', protect, validateExamAnswerId, validateExamAnswer, updateExamAnswer);
router.delete('/:id', protect, restrictTo('admin'), validateExamAnswerId, deleteExamAnswer);

module.exports = router;