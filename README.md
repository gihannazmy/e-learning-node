# E-Learning API

A Node.js REST API for an e-learning platform built with Express.js and MongoDB.

## Features

- User authentication (signup, login, logout)
- Role-based access control (student, instructor, admin)
- Course management
- Department management
- Student enrollment
- Exam system
- Media management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your actual configuration values.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and configure the following:

### Required Environment Variables

- `NODE_ENV`: Environment (development/production/test)
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a long random string)

### Optional Environment Variables

- `EMAIL_*`: Email configuration for password reset features
- `REDIS_URL`: Redis connection for caching
- `RATE_LIMIT_*`: Rate limiting configuration
- `CORS_*`: CORS configuration

### Environment Files

- `.env`: Development configuration
- `.env.production`: Production configuration
- `.env.test`: Test configuration

## API Endpoints

### Authentication

#### POST /api/v1/users/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt-token-here",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

#### POST /api/v1/users/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt-token-here",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com"
    }
  }
}
```

#### GET /api/v1/users/logout
Logout the current user.

### Protected Routes

All other routes require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Project Structure

```
├── controllers/     # Route controllers
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── db.js           # Database connection
├── index.js        # Server entry point
├── .env.example    # Environment template
└── package.json    # Dependencies
```

## Development

### Available Scripts

- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests
- `npm start`: Start production server

### Health Check

GET `/health` - Check server status and environment

## Security

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Security headers