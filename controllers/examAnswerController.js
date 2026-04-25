const ExamAnswer = require('../models/ExamAnswer');

exports.createExamAnswer = async (req, res) => {
  try {
    const examAnswer = await ExamAnswer.create(req.body);
    res.status(201).json(examAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExamAnswers = async (req, res) => {
  try {
    const examAnswers = await ExamAnswer.find().populate('examQuestionId').populate('studentId');
    res.json(examAnswers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExamAnswer = async (req, res) => {
  try {
    const examAnswer = await ExamAnswer.findById(req.params.id).populate('examQuestionId').populate('studentId');
    if (!examAnswer) {
      return res.status(404).json({ error: 'ExamAnswer not found' });
    }
    res.json(examAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExamAnswer = async (req, res) => {
  try {
    const examAnswer = await ExamAnswer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!examAnswer) {
      return res.status(404).json({ error: 'ExamAnswer not found' });
    }
    res.json(examAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteExamAnswer = async (req, res) => {
  try {
    const examAnswer = await ExamAnswer.findByIdAndDelete(req.params.id);
    if (!examAnswer) {
      return res.status(404).json({ error: 'ExamAnswer not found' });
    }
    res.json({ message: 'ExamAnswer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};