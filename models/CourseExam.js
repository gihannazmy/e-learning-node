const mongoose = require('mongoose');

const courseExamSchema = new mongoose.Schema({
  examId: Number,

  courseId: {
    type: Number,
    ref: 'Course'
  },

  title: String,
  description: String,
  minDegree: Number,
  maxDegree: Number
});

module.exports = mongoose.model('CourseExam', courseExamSchema);