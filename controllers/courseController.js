const Course = require('../models/courses');

exports.createCourse = async (req, res) => {
  res.json(await Course.create(req.body));
};

exports.getCourses = async (req, res) => {
  res.json(await Course.find());
};

exports.getCourse = async (req, res) => {
  res.json(await Course.findById(req.params.id));
};

exports.updateCourse = async (req, res) => {
  res.json(await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

exports.deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};