const StudentCourse = require('../models/StudentCourse');

exports.createStudentCourse = async (req, res) => {
  try {
    const studentCourse = await StudentCourse.create(req.body);
    res.status(201).json(studentCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const studentCourses = await StudentCourse.find().populate('courseId').populate('studentId');
    res.json(studentCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentCourse = async (req, res) => {
  try {
    const studentCourse = await StudentCourse.findById(req.params.id).populate('courseId').populate('studentId');
    if (!studentCourse) {
      return res.status(404).json({ error: 'StudentCourse not found' });
    }
    res.json(studentCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudentCourse = async (req, res) => {
  try {
    const studentCourse = await StudentCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!studentCourse) {
      return res.status(404).json({ error: 'StudentCourse not found' });
    }
    res.json(studentCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStudentCourse = async (req, res) => {
  try {
    const studentCourse = await StudentCourse.findByIdAndDelete(req.params.id);
    if (!studentCourse) {
      return res.status(404).json({ error: 'StudentCourse not found' });
    }
    res.json({ message: 'StudentCourse deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};