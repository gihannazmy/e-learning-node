const CourseMedia = require('../models/CourseMedia');

exports.createCourseMedia = async (req, res) => {
  try {
    const courseMedia = await CourseMedia.create(req.body);
    res.status(201).json(courseMedia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourseMedias = async (req, res) => {
  try {
    const courseMedias = await CourseMedia.find().populate('detailId');
    res.json(courseMedias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseMedia = async (req, res) => {
  try {
    const courseMedia = await CourseMedia.findById(req.params.id).populate('detailId');
    if (!courseMedia) {
      return res.status(404).json({ error: 'CourseMedia not found' });
    }
    res.json(courseMedia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourseMedia = async (req, res) => {
  try {
    const courseMedia = await CourseMedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!courseMedia) {
      return res.status(404).json({ error: 'CourseMedia not found' });
    }
    res.json(courseMedia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourseMedia = async (req, res) => {
  try {
    const courseMedia = await CourseMedia.findByIdAndDelete(req.params.id);
    if (!courseMedia) {
      return res.status(404).json({ error: 'CourseMedia not found' });
    }
    res.json({ message: 'CourseMedia deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};