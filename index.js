require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./utils/config');

const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')
const instructorRoutes = require('./routes/instructorRoutes')
const departmentRoutes = require('./routes/departmentRoutes')
const courseDetailRoutes = require('./routes/courseDetailRoutes')
const courseMediaRoutes = require('./routes/courseMediaRoutes')
const studentRoutes = require('./routes/studentRoutes')
const studentCourseRoutes = require('./routes/studentCourseRoutes')
const courseExamRoutes = require('./routes/courseExamRoutes')
const examQuestionRoutes = require('./routes/examQuestionRoutes')
const examAnswerRoutes = require('./routes/examAnswerRoutes')

const connectDB = require('./db');
const {
  sanitizeData,
  preventXSS,
  setSecurityHeaders,
  apiLimiter,
  authLimiter,
  corsOptions
} = require('./utils/security');

const app = express();

// Security middleware
app.use(setSecurityHeaders);

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/signup', authLimiter);

// CORS (use configured corsOptions)
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(sanitizeData);
app.use(preventXSS);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

//routes
app.use(`${config.api.baseUrl}/users`, userRoutes);
app.use(`${config.api.baseUrl}/courses`, courseRoutes);
app.use(`${config.api.baseUrl}/instructors`, instructorRoutes);
app.use(`${config.api.baseUrl}/departments`, departmentRoutes);
app.use(`${config.api.baseUrl}/course-details`, courseDetailRoutes);
app.use(`${config.api.baseUrl}/course-media`, courseMediaRoutes);
app.use(`${config.api.baseUrl}/students`, studentRoutes);
app.use(`${config.api.baseUrl}/student-courses`, studentCourseRoutes);
app.use(`${config.api.baseUrl}/course-exams`, courseExamRoutes);
app.use(`${config.api.baseUrl}/exam-questions`, examQuestionRoutes);
app.use(`${config.api.baseUrl}/exam-answers`, examAnswerRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(config.fileUpload.path));

//global handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: 'error',
      message: config.isProduction() ? 'Something went wrong!' : err.message,
      ...(config.isDevelopment() && { stack: err.stack })
    });
});

// Handle 404 - this should be the last route
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`
  });
});

let server;
if (require.main === module) {
  connectDB();
  server = app.listen(config.port, config.host, () => {
    console.log(`Server running in ${config.env} mode on http://${config.host}:${config.port}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = app;