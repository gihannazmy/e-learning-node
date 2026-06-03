const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');

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
  // Simple XSS prevention by escaping HTML characters in string fields
  const escapeHtml = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, (match) => {
      const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return escapeMap[match];
    });
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = escapeHtml(req.body[key]);
      }
    });
  }

  next();
};

// Set security headers
const setSecurityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
});

// Rate limiting
const createRateLimit = (options = {}) => {
  const defaultOptions = {
    windowMs: config.security.rateLimit.window * 60 * 1000, // minutes to milliseconds
    max: config.security.rateLimit.maxRequests,
    message: {
      status: 'error',
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  };

  return rateLimit({ ...defaultOptions, ...options });
};

// General API rate limiter
const apiLimiter = createRateLimit();

// Auth rate limiter (more restrictive)
const authLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  }
});

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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In development allow any origin to simplify local testing (localhost:5000 frontend).
    if (config.isDevelopment()) return callback(null, true);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = {
  sanitizeData,
  preventXSS,
  setSecurityHeaders,
  apiLimiter,
  authLimiter,
  sanitizeInput,
  sanitizeObject,
  corsOptions
};