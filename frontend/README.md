# Frontend prototype

This folder contains a static HTML/CSS/JS prototype matching the Figma layout with polished responsive styling.

Available pages:

- `index.html` — login page
- `signup.html` — registration page
- `forgot.html` — password reset page
- `landing.html` — marketing landing page
- `dashboard.html` — student dashboard preview
- `courses.html` — course browsing page
- `course-detail.html` — course detail page
- `exams.html` — exam list page
- `profile.html` — user profile page
- `admin.html` — admin console for managing all backend models/controllers

Use the `assets/` folder to replace placeholder SVGs with exports from Figma when available.

`css/style.css` contains the main styling.
`js/app.js` includes prototype form handling and mock navigation for auth pages.
`js/admin.js` powers the admin console and supports CRUD operations for all resources.

To view locally, run a simple static server from the project root on a port other than the backend port:

```bash
npx serve frontend -l 5000
```

Then open the local URL that `serve` provides.

Important notes when running locally:
- Run the backend first (default port 3000):

```bash
npm run dev
```

- Serve the frontend on a different port than the backend to avoid static server/API conflicts. For example:

```bash
npx serve frontend -l 5000
```

- The admin console at `frontend/admin.html` expects the API at `http://localhost:3000/api/v1`. If your backend is running on a different port or host, set the API base in your browser before loading pages:

```js
localStorage.setItem('frontendApiUrl', 'http://localhost:3000/api/v1');
```

- If the frontend cannot reach the API the pages now show a small banner with troubleshooting steps (check DevTools → Network to inspect requests).
