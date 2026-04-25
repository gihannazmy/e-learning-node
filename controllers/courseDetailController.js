const CourseDetail = require('../models/CourseDetail');

exports.createCourseDetail = async (req, res) => {
  try {
    const courseDetail = await CourseDetail.create(req.body);
    res.status(201).json(courseDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const courseDetails = await CourseDetail.find().populate('courseId').populate('instructorId');
    res.json(courseDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const courseDetail = await CourseDetail.findById(req.params.id).populate('courseId').populate('instructorId');
    if (!courseDetail) {
      return res.status(404).json({ error: 'CourseDetail not found' });
    }
    res.json(courseDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourseDetail = async (req, res) => {
  try {
    const courseDetail = await CourseDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!courseDetail) {
      return res.status(404).json({ error: 'CourseDetail not found' });
    }
    res.json(courseDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourseDetail = async (req, res) => {
  try {
    const courseDetail = await CourseDetail.findByIdAndDelete(req.params.id);
    if (!courseDetail) {
      return res.status(404).json({ error: 'CourseDetail not found' });
    }
    res.json({ message: 'CourseDetail deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};