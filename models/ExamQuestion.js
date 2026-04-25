const mongoose = require('mongoose');

const examQuestionSchema = new mongoose.Schema({
  examQuestionId: Number,

  courseExamId: {
    type: Number,
    ref: 'CourseExam'
  },

  question: String,
  rightFlag: Boolean,
  point: Number
});

module.exports = mongoose.model('ExamQuestion', examQuestionSchema);