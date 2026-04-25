const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: Number,

  departmentId: {
    type: Number,
    ref: 'Department'
  },

  courseName: String
});

module.exports = mongoose.model('Course', courseSchema);