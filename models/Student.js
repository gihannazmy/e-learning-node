const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: Number,
  studentName: String,
  registerDate: Date
});

module.exports = mongoose.model('Student', studentSchema);