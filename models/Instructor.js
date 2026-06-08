const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  instructorId: Number,
  instructorName: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  specialization: String,
  bio: String,
  experience: Number
}, { timestamps: true });

module.exports = mongoose.model('Instructor', instructorSchema);
