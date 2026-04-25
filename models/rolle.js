const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleId: Number,
  roleName: String // Administrator, Instructor, Student
});

module.exports = mongoose.model('Role', roleSchema);