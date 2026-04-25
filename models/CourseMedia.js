const mongoose = require('mongoose');

const courseMediaSchema = new mongoose.Schema({
  mediaId: Number,

  detailId: {
    type: Number,
    ref: 'CourseDetail'
  },

  path: String
});

module.exports = mongoose.model('CourseMedia', courseMediaSchema);