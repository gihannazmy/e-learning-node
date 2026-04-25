const express = require('express');
const router = express.Router();
const {
  createExamAnswer,
  getExamAnswers,
  getExamAnswer,
  updateExamAnswer,
  deleteExamAnswer
} = require('../controllers/examAnswerController');

router.post('/', createExamAnswer);
router.get('/', getExamAnswers);
router.get('/:id', getExamAnswer);
router.put('/:id', updateExamAnswer);
router.delete('/:id', deleteExamAnswer);

module.exports = router;