# E-Learning Project

The primary goal is to develop a Learning Management System (LMS) that provides a centralized, scalable environment for hosting, delivering, and tracking educational content. The platform aims to democratize access to learning by allowing users to engage with materials at their own pace, regardless of geographical constraints.

## Tecnologies : 

A Node.js REST API for an e-learning platform built with Express.js and MongoDB.

## Features

- User authentication (signup, login, logout)
- Role-based access control (student, instructor, admin)
- Course and department management
- Student enrollment and exam workflows
- Media upload and streaming support
- Input validation, sanitization, and rate limiting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file with your configuration values.
5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

The application loads environment variables from `.env`, with optional overrides from:

- `.env.production`
- `.env.test`

### Required Environment Variables

- `NODE_ENV`: Environment (development/production/test)
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

### Optional Environment Variables

- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`
- `REDIS_URL`
- `RATE_LIMIT_WINDOW`, `RATE_LIMIT_MAX_REQUESTS`
- `FRONTEND_URL`, `ALLOWED_ORIGINS`
- `FILE_UPLOAD_PATH`, `MAX_FILE_SIZE`

## API Endpoints

### Health Check

- `GET /health`

Returns server health, timestamp, and current environment.

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

### Authorization

Protected endpoints require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

### Users

- `GET /api/v1/users` — list users (admin only)
- `GET /api/v1/users/:id` — get user details
- `PATCH /api/v1/users/:id` — update user profile
- `DELETE /api/v1/users/:id` — delete a user

### Courses

- `GET /api/v1/courses` — list courses
- `GET /api/v1/courses/:id` — get a course by ID
- `POST /api/v1/courses` — create a course
- `PATCH /api/v1/courses/:id` — update a course
- `DELETE /api/v1/courses/:id` — delete a course

### Instructors

- `GET /api/v1/instructors` — list instructors
- `GET /api/v1/instructors/:id` — get instructor details
- `POST /api/v1/instructors` — create instructor profile
- `PATCH /api/v1/instructors/:id` — update instructor
- `DELETE /api/v1/instructors/:id` — remove instructor

### Departments

- `GET /api/v1/departments` — list departments
- `GET /api/v1/departments/:id` — get department details
- `POST /api/v1/departments` — create department
- `PATCH /api/v1/departments/:id` — update department
- `DELETE /api/v1/departments/:id` — delete department

### Course Details

- `GET /api/v1/course-details` — list course details
- `POST /api/v1/course-details` — add details to a course
- `PATCH /api/v1/course-details/:id` — update course detail
- `DELETE /api/v1/course-details/:id` — remove course detail

### Course Media

#### POST /api/v1/course-media/upload
Upload media for a course. The request should be multipart form-data.

Example fields:
- `courseId`
- `title`
- `description`
- `type` (e.g. `video`, `image`, `document`)
- `media` file upload field

#### GET /api/v1/course-media
List uploaded course media items.

#### GET /api/v1/course-media/stream/:id
Stream a media file by its ID.

#### GET /api/v1/course-media/stats
Get media upload statistics.

### Students

- `GET /api/v1/students` — list students
- `GET /api/v1/students/:id` — get student profile
- `POST /api/v1/students` — add student record
- `PATCH /api/v1/students/:id` — update student record
- `DELETE /api/v1/students/:id` — delete student record

### Student Courses

- `GET /api/v1/student-courses` — list enrollments
- `POST /api/v1/student-courses` — enroll a student in a course
- `PATCH /api/v1/student-courses/:id` — update enrollment
- `DELETE /api/v1/student-courses/:id` — remove enrollment

### Course Exams

- `GET /api/v1/course-exams` — list exams
- `GET /api/v1/course-exams/:id` — get exam details
- `POST /api/v1/course-exams` — create exam
- `PATCH /api/v1/course-exams/:id` — update exam
- `DELETE /api/v1/course-exams/:id` — delete exam

### Exam Questions

- `GET /api/v1/exam-questions` — list questions
- `GET /api/v1/exam-questions/:id` — get question details
- `POST /api/v1/exam-questions` — create question
- `PATCH /api/v1/exam-questions/:id` — update question
- `DELETE /api/v1/exam-questions/:id` — delete question

### Exam Answers

- `GET /api/v1/exam-answers` — list answers
- `GET /api/v1/exam-answers/:id` — get answer details
- `POST /api/v1/exam-answers` — submit an answer
- `PATCH /api/v1/exam-answers/:id` — update answer
- `DELETE /api/v1/exam-answers/:id` — delete answer

### Default Response Format

Most endpoints return JSON in the following shape:

```json
{
  "status": "success",
  "data": { ... }
}
```

If an error occurs, the response returns:

```json
{
  "status": "fail",
  "message": "Error description"
}
```

### Supported Resources

- `/api/v1/users`
- `/api/v1/courses`
- `/api/v1/instructors`
- `/api/v1/departments`
- `/api/v1/course-details`
- `/api/v1/course-media`
- `/api/v1/students`
- `/api/v1/student-courses`
- `/api/v1/course-exams`
- `/api/v1/exam-questions`
- `/api/v1/exam-answers`

## Project Structure

```
├── controllers/     # Route controllers
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions and middleware
├── tests/           # Jest test suites
├── db.js            # Database connection helper
├── index.js         # Server entry point
├── .env.example     # Environment template
└── package.json     # Dependencies and scripts
```

## Development

### Available Scripts

- `npm run dev`: Start development server with nodemon
- `npm test`: Run Jest tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm start`: Start production server

### Testing

The project includes Jest tests for:

- application health and route handling
- file upload validation logic
- `CourseMedia` model validation and persistence

Run tests with:

```bash
npm test
```

## Security

- JWT authentication
- Password hashing with bcrypt
- Input sanitization and validation
- Rate limiting
- CORS configuration
- Security headers
