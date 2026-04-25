const mongoose = require('mongoose');

const examAnswerSchema = new mongoose.Schema({
  examAnswerId: Number,

  examQuestionId: {
    type: Number,
    ref: 'ExamQuestion'
  },

  studentId: {
    type: Number,
    ref: 'Student'
  },

  rightFlag: Boolean,
  degree: Number
});

module.exports = mongoose.model('ExamAnswer', examAnswerSchema);