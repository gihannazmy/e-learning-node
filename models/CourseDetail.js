const mongoose = require('mongoose');

const courseDetailSchema = new mongoose.Schema({
  detailsId: Number,

  courseId: {
    type: Number,
    ref: 'Course'
  },

  instructorId: {
    type: Number,
    ref: 'Instructor'
  },

  title: String,
  description: String,
  duration: Number
});

module.exports = mongoose.model('CourseDetail', courseDetailSchema);