const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentId: Number,
  departmentName: String
});

module.exports = mongoose.model('Department', departmentSchema);