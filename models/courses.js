const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: Number,
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  courseName: String,
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
  },
  duration: Number,
  price: Number,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  }
}, { timestamps: true });

courseSchema.pre('save', function () {
  if (this.title && !this.courseName) {
    this.courseName = this.title;
  }
  if (this.courseName && !this.title) {
    this.title = this.courseName;
  }
});

module.exports = mongoose.model('Course', courseSchema);
