const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentId: Number,
  departmentName: String,
  name: String,
  description: String,
  headId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

departmentSchema.pre('save', function () {
  if (this.name && !this.departmentName) {
    this.departmentName = this.name;
  }
  if (this.departmentName && !this.name) {
    this.name = this.departmentName;
  }
});

module.exports = mongoose.model('Department', departmentSchema);
