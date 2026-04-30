const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// User validation rules
const validateUserSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .optional()
    .isIn(['student', 'instructor', 'admin'])
    .withMessage('Role must be student, instructor, or admin'),

  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Course validation rules
const validateCourse = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Course title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('departmentId')
    .isMongoId()
    .withMessage('Please provide a valid department ID'),

  body('instructorId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid instructor ID'),

  body('duration')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),

  handleValidationErrors
];

const validateCourseId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid course ID'),

  handleValidationErrors
];

// Department validation rules
const validateDepartment = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department name must be between 2 and 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),

  body('headId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid head ID'),

  handleValidationErrors
];

const validateDepartmentId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid department ID'),

  handleValidationErrors
];

// Instructor validation rules
const validateInstructor = [
  body('userId')
    .isMongoId()
    .withMessage('Please provide a valid user ID'),

  body('specialization')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Specialization must be less than 100 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters'),

  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),

  handleValidationErrors
];

const validateInstructorId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid instructor ID'),

  handleValidationErrors
];

// Student validation rules
const validateStudent = [
  body('userId')
    .isMongoId()
    .withMessage('Please provide a valid user ID'),

  body('enrollmentYear')
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid enrollment year'),

  body('gpa')
    .optional()
    .isFloat({ min: 0, max: 4.0 })
    .withMessage('GPA must be between 0 and 4.0'),

  handleValidationErrors
];

const validateStudentId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid student ID'),

  handleValidationErrors
];

// Exam validation rules
const validateExam = [
  body('courseId')
    .isMongoId()
    .withMessage('Please provide a valid course ID'),

  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Exam title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),

  body('duration')
    .isInt({ min: 5, max: 180 })
    .withMessage('Duration must be between 5 and 180 minutes'),

  body('totalMarks')
    .isInt({ min: 1, max: 100 })
    .withMessage('Total marks must be between 1 and 100'),

  body('passingMarks')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Passing marks must be at least 1'),

  body('examDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid exam date'),

  handleValidationErrors
];

const validateExamId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid exam ID'),

  handleValidationErrors
];

// Exam question validation rules
const validateExamQuestion = [
  body('examId')
    .isMongoId()
    .withMessage('Please provide a valid exam ID'),

  body('question')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Question must be between 10 and 500 characters'),

  body('questionType')
    .isIn(['multiple-choice', 'true-false', 'short-answer'])
    .withMessage('Question type must be multiple-choice, true-false, or short-answer'),

  body('options')
    .if(body('questionType').equals('multiple-choice'))
    .isArray({ min: 2, max: 6 })
    .withMessage('Options must be an array with 2-6 items'),

  body('correctAnswer')
    .if(body('questionType').equals('multiple-choice'))
    .isInt({ min: 0, max: 5 })
    .withMessage('Correct answer index must be between 0 and 5'),

  body('correctAnswer')
    .if(body('questionType').equals('true-false'))
    .isBoolean()
    .withMessage('Correct answer must be true or false'),

  body('marks')
    .isInt({ min: 1, max: 10 })
    .withMessage('Marks must be between 1 and 10'),

  handleValidationErrors
];

const validateExamQuestionId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid question ID'),

  handleValidationErrors
];

// Exam answer validation rules
const validateExamAnswer = [
  body('examId')
    .isMongoId()
    .withMessage('Please provide a valid exam ID'),

  body('studentId')
    .isMongoId()
    .withMessage('Please provide a valid student ID'),

  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),

  body('totalScore')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total score must be a positive number'),

  handleValidationErrors
];

const validateExamAnswerId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid answer ID'),

  handleValidationErrors
];

// Course media validation rules
const validateCourseMedia = [
  body('courseId')
    .isMongoId()
    .withMessage('Please provide a valid course ID'),

  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Media title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),

  body('type')
    .isIn(['video', 'audio', 'document', 'image'])
    .withMessage('Type must be video, audio, document, or image'),

  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),

  handleValidationErrors
];

const validateCourseMediaId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid media ID'),

  handleValidationErrors
];

// Course detail validation rules
const validateCourseDetail = [
  body('courseId')
    .isMongoId()
    .withMessage('Please provide a valid course ID'),

  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),

  body('contentType')
    .isIn(['text', 'video', 'quiz', 'assignment'])
    .withMessage('Content type must be text, video, quiz, or assignment'),

  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),

  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),

  handleValidationErrors
];

const validateCourseDetailId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid detail ID'),

  handleValidationErrors
];

// Student course (enrollment) validation rules
const validateStudentCourse = [
  body('studentId')
    .isMongoId()
    .withMessage('Please provide a valid student ID'),

  body('courseId')
    .isMongoId()
    .withMessage('Please provide a valid course ID'),

  body('enrollmentDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid enrollment date'),

  body('completionStatus')
    .optional()
    .isIn(['not-started', 'in-progress', 'completed'])
    .withMessage('Completion status must be not-started, in-progress, or completed'),

  body('progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),

  handleValidationErrors
];

const validateStudentCourseId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid enrollment ID'),

  handleValidationErrors
];

module.exports = {
  validateUserSignup,
  validateUserLogin,
  validateCourse,
  validateCourseId,
  validateDepartment,
  validateDepartmentId,
  validateInstructor,
  validateInstructorId,
  validateStudent,
  validateStudentId,
  validateExam,
  validateExamId,
  validateExamQuestion,
  validateExamQuestionId,
  validateExamAnswer,
  validateExamAnswerId,
  validateCourseMedia,
  validateCourseMediaId,
  validateCourseDetail,
  validateCourseDetailId,
  validateStudentCourse,
  validateStudentCourseId,
  handleValidationErrors
};