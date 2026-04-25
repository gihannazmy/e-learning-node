const mongoose = require('mongoose');

const studentCourseSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    ref: 'Course'
  },

  studentId: {
    type: Number,
    ref: 'Student'
  },

  registerDate: Date
});

module.exports = mongoose.model('StudentCourse', studentCourseSchema);