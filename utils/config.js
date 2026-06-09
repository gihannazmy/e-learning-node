const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const loadEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  // Load base .env file
  dotenv.config();

  // Load environment-specific .env file if it exists
  if (env === 'production') {
    dotenv.config({ path: '.env.production', override: true });
  } else if (env === 'test') {
    dotenv.config({ path: '.env.test', override: true });
  }
};

// Load configuration
loadEnvironmentConfig();

// Configuration object
const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',

  // Server
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST || '0.0.0.0',

  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/e-learning',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/e-learning-test',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    cookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 90,
  },

  // Email
  email: {
    from: process.env.EMAIL_FROM || 'noreply@elearning.com',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },

  // File Upload
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5000000,
    path: process.env.FILE_UPLOAD_PATH || './uploads',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    rateLimit: {
      window: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15,
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    },
  },

  // CORS
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    // allow common local frontend ports (3000 and 5000) by default; can be overridden by ALLOWED_ORIGINS env
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000'
    ],
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL,
  },

  // API
  api: {
    version: process.env.API_VERSION || 'v1',
    baseUrl: process.env.API_BASE_URL || '/api/v1',
  },

  // Helper methods
  isDevelopment: () => config.env === 'development',
  isProduction: () => config.env === 'production',
  isTest: () => config.env === 'test',
};

module.exports = config;