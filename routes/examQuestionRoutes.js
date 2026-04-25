const express = require('express');
const router = express.Router();
const {
  createExamQuestion,
  getExamQuestions,
  getExamQuestion,
  updateExamQuestion,
  deleteExamQuestion
} = require('../controllers/examQuestionController');

router.post('/', createExamQuestion);
router.get('/', getExamQuestions);
router.get('/:id', getExamQuestion);
router.put('/:id', updateExamQuestion);
router.delete('/:id', deleteExamQuestion);

module.exports = router;