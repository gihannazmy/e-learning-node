const ExamQuestion = require('../models/ExamQuestion');

exports.createExamQuestion = async (req, res) => {
  try {
    const examQuestion = await ExamQuestion.create(req.body);
    res.status(201).json(examQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExamQuestions = async (req, res) => {
  try {
    const examQuestions = await ExamQuestion.find().populate('courseExamId');
    res.json(examQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExamQuestion = async (req, res) => {
  try {
    const examQuestion = await ExamQuestion.findById(req.params.id).populate('courseExamId');
    if (!examQuestion) {
      return res.status(404).json({ error: 'ExamQuestion not found' });
    }
    res.json(examQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExamQuestion = async (req, res) => {
  try {
    const examQuestion = await ExamQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!examQuestion) {
      return res.status(404).json({ error: 'ExamQuestion not found' });
    }
    res.json(examQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteExamQuestion = async (req, res) => {
  try {
    const examQuestion = await ExamQuestion.findByIdAndDelete(req.params.id);
    if (!examQuestion) {
      return res.status(404).json({ error: 'ExamQuestion not found' });
    }
    res.json({ message: 'ExamQuestion deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};