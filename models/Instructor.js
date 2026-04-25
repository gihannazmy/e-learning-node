const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  instructorId: Number,
  instructorName: String
});

module.exports = mongoose.model('Instructor', instructorSchema);