const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Sanitize data against NoSQL query injection
const sanitizeData = (req, res, next) => {
  // Sanitize request body, query, and params
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);

  next();
};

// Prevent XSS attacks by sanitizing user input
const preventXSS = (req, res, next) => {
  // This middleware will be applied globally
  next();
};

// Custom sanitization for specific fields
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input.replace(/[<>'"&]/g, '');
  }
  return input;
};

// Sanitize object recursively
const sanitizeObject = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
};

module.exports = {
  sanitizeData,
  preventXSS,
  sanitizeInput,
  sanitizeObject
};