const CourseExam = require('../models/CourseExam');

exports.createCourseExam = async (req, res) => {
  try {
    const courseExam = await CourseExam.create(req.body);
    res.status(201).json(courseExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourseExams = async (req, res) => {
  try {
    const courseExams = await CourseExam.find().populate('courseId');
    res.json(courseExams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseExam = async (req, res) => {
  try {
    const courseExam = await CourseExam.findById(req.params.id).populate('courseId');
    if (!courseExam) {
      return res.status(404).json({ error: 'CourseExam not found' });
    }
    res.json(courseExam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourseExam = async (req, res) => {
  try {
    const courseExam = await CourseExam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!courseExam) {
      return res.status(404).json({ error: 'CourseExam not found' });
    }
    res.json(courseExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourseExam = async (req, res) => {
  try {
    const courseExam = await CourseExam.findByIdAndDelete(req.params.id);
    if (!courseExam) {
      return res.status(404).json({ error: 'CourseExam not found' });
    }
    res.json({ message: 'CourseExam deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};