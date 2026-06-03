# E-Learning Node API

This repository contains a Node.js REST API for an e-learning platform (LMS) built with Express and MongoDB plus a small static frontend prototype in `frontend/`.

This README was updated to reflect the current project structure, available scripts, configuration defaults, and media upload capabilities.

## Quick Summary

- API base path: `/api/v1` (configurable)
- Default server port: `3000`
- Local uploads directory: `./uploads` (configurable)
- Tests use an in-memory MongoDB server when `NODE_ENV=test`

## Features

- User authentication (JWT)
- Role-based access control (student, instructor, admin)
- Course, department and instructor management
- Student enrollment and course exams
- Media upload, streaming, and management
- Validation, sanitization, security headers and rate limiting

## Getting started

Prerequisites:

- Node.js (v14+)
- MongoDB (unless using `NODE_ENV=test` and the in-memory server)

Install dependencies:

```bash
npm install
```

Copy and edit env template (if you have it):

```bash
cp .env.example .env
# then edit .env to set your values
```

Start development server:

```bash
npm run dev
```

Serve the static frontend (from repo root):

```bash
npm run serve-frontend
```

Run both backend and frontend concurrently:

```bash
npm run dev:full
```

Start production server:

```bash
npm start
```

## Available scripts

The project `package.json` exposes these scripts:

- `dev` — run `nodemon .` (development server)
- `serve-frontend` — serve the `frontend/` folder on port 5000
- `dev:full` — run backend and frontend concurrently
- `start` — start production server (`NODE_ENV=production node .`)
- `test` — `NODE_ENV=test jest`
- `test:watch` — jest in watch mode
- `test:coverage` — jest with coverage

## Configuration (environment variables)

Key variables (see `utils/config.js` defaults):

- `NODE_ENV` — `development|production|test` (default `development`)
- `PORT` — server port (default `3000`)
- `MONGODB_URI` — production/dev MongoDB connection
- `MONGODB_TEST_URI` — optional test DB connection (fallback to in-memory server)
- `JWT_SECRET` — JWT signing key
- `JWT_EXPIRES_IN` — token lifetime (default `90d`)
- `FILE_UPLOAD_PATH` — default `./uploads`
- `MAX_FILE_SIZE` — default `5000000` (5MB)
- `RATE_LIMIT_WINDOW` / `RATE_LIMIT_MAX_REQUESTS` — rate limiter settings
- `FRONTEND_URL` / `ALLOWED_ORIGINS` — CORS settings

If you rely on environment-specific files, the app will load `.env`, then override with `.env.production` or `.env.test` when `NODE_ENV` is set accordingly.

## Media upload & streaming

The project includes a comprehensive media upload API. See [MEDIA_UPLOAD_README.md](MEDIA_UPLOAD_README.md) for full details including endpoints, accepted file types, streaming support, and example requests.

Short notes:

- Uploads are stored by default in `./uploads` with unique filenames.
- The API supports range requests for video/audio streaming.
- Max upload size is controlled by `MAX_FILE_SIZE`.

## Tests

Tests are implemented with `jest`, `supertest`, and `mongodb-memory-server` (for fast, isolated tests).

Run tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

## Project structure

```
├── controllers/     # Route controllers
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utilities and middleware (config, fileUpload, auth)
├── tests/           # Jest test suites
├── db.js            # Database connection helper
├── index.js         # Server entry point
├── frontend/        # Static frontend prototype (HTML/CSS/JS)
├── uploads/         # Local file storage for media
└── package.json     # Dependencies and scripts
```

## Security

- JWT authentication
- Password hashing (`bcrypt`)
- Input sanitization (`express-mongo-sanitize`, `xss-clean`)
- HTTP security headers (`helmet`)
- Rate limiting (`express-rate-limit`)

## Troubleshooting & tips

- If tests fail locally, ensure no other MongoDB instance is conflicting or run with `NODE_ENV=test` so the in-memory server is used.
- For large media files, adjust `MAX_FILE_SIZE` and consider external storage (S3) for production.

## Contributing

Contributions and improvements are welcome. Open an issue or create a pull request.

## License

This project is provided under the `ISC` license as specified in `package.json`.

