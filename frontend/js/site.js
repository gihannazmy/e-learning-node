document.addEventListener('DOMContentLoaded', () => {
  const apiBase = localStorage.getItem('frontendApiUrl') || 'http://localhost:3000/api/v1';
  const authTokenKey = 'elearningAuthToken';
  const userKey = 'elearningUser';

  function getHeaders(isJson = true) {
    const headers = {};
    if (isJson) headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem(authTokenKey);
    if (token) headers.Authorization = token;
    return headers;
  }

  function handleResponse(response) {
    return response.json().then((data) => {
      if (!response.ok) {
        const message = data.message || data.error || 'Failed request';
        return Promise.reject(new Error(message));
      }
      return data;
    });
  }

  function getQueryValue(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  function saveUser(user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  }

  function loadUserStorage() {
    const raw = localStorage.getItem(userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function requireAuth() {
    if (!localStorage.getItem(authTokenKey)) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  function signOut() {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(userKey);
    window.location.href = 'index.html';
  }

  function renderCourseCard(course) {
    const item = document.createElement('div');
    item.className = 'course-card';
    item.innerHTML = `
      <strong>${course.title || course.courseName || 'Untitled course'}</strong>
      <p>${course.description || 'No course description available.'}</p>
      <p><small>Department: ${course.departmentId?.name || course.departmentId?.departmentName || 'Unknown'}</small></p>
      <p><small>Level: ${course.level || 'N/A'}</small></p>
      <a class="btn outline" href="course-detail.html?id=${course._id || course.id}">View details</a>
    `;
    return item;
  }

  function renderExamCard(exam) {
    const item = document.createElement('div');
    item.className = 'course-card';
    item.innerHTML = `
      <strong>${exam.title}</strong>
      <p>${exam.description || 'No description available.'}</p>
      <p><small>Course ID: ${exam.courseId || exam.courseId?._id || 'Unknown'}</small></p>
      <p><small>Range: ${exam.minDegree || 0}–${exam.maxDegree || 0}</small></p>
    `;
    return item;
  }

  async function fetchJson(path, options = {}) {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: getHeaders(options.body ? options.json !== false : false)
    });
    return handleResponse(response);
  }

  function renderProfile() {
    const profile = loadUserStorage();
    const container = document.getElementById('profileContent');
    if (!profile || !container) return;

    container.innerHTML = `
      <div class="course-card">
        <strong>${profile.name || 'Student'}</strong>
        <p><strong>Email:</strong> ${profile.email || 'Not available'}</p>
        <p><strong>User ID:</strong> ${profile.id || profile._id || 'Unknown'}</p>
        <p>${profile.role ? `Role: ${profile.role}` : 'Role information is not available.'}</p>
      </div>
    `;
  }

  async function loadCourses() {
    const container = document.getElementById('coursesContainer');
    if (!container) return;
    container.innerHTML = '<p>Loading courses…</p>';
    try {
      const result = await fetchJson('/courses', { method: 'GET' });
      const courses = result.data?.courses || result.courses || result;
      container.innerHTML = '';
      if (!courses || courses.length === 0) {
        container.innerHTML = '<p>No courses available yet.</p>';
        return;
      }
      courses.forEach((course) => container.appendChild(renderCourseCard(course)));
    } catch (error) {
      container.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  async function loadDashboard() {
    if (!requireAuth()) return;
    const coursesContainer = document.querySelector('.course-list');
    const summary = document.querySelector('.dashboard-summary');
    const userProfile = loadUserStorage();
    if (userProfile) {
      const greeting = document.querySelector('.section-title');
      if (greeting) greeting.textContent = `Welcome back, ${userProfile.name || 'Student'}`;
    }

    if (coursesContainer) {
      coursesContainer.innerHTML = '<li class="course-card"><strong>Loading your courses…</strong></li>';
      try {
        const result = await fetchJson('/courses', { method: 'GET' });
        const courses = result.data?.courses || result.courses || result;
        coursesContainer.innerHTML = '';
        if (!courses || courses.length === 0) {
          coursesContainer.innerHTML = '<li class="course-card"><strong>No courses available.</strong></li>';
          return;
        }
        courses.slice(0, 4).forEach((course) => {
          const li = document.createElement('li');
          li.className = 'course-card';
          li.innerHTML = `
            <strong>${course.title || course.courseName || 'Untitled course'}</strong>
            <p>${course.description || 'No description.'}</p>
          `;
          coursesContainer.appendChild(li);
        });
        if (summary) {
          summary.innerHTML = `
            <div class="summary-card"><strong>${courses.length}</strong><span>Total courses</span></div>
            <div class="summary-card"><strong>3</strong><span>New courses</span></div>
            <div class="summary-card"><strong>84%</strong><span>Learning goal</span></div>
          `;
        }
      } catch (error) {
        coursesContainer.innerHTML = `<li class="course-card"><strong>${error.message}</strong></li>`;
      }
    }
  }

  async function loadCourseDetail() {
    if (!requireAuth()) return;
    const courseId = getQueryValue('id');
    const titleEl = document.getElementById('courseTitle');
    const descriptionEl = document.getElementById('courseDescription');
    const metaEl = document.getElementById('courseMeta');
    const extraEl = document.getElementById('courseExtra');
    if (!courseId || !titleEl) {
      window.location.href = 'courses.html';
      return;
    }

    titleEl.textContent = 'Loading course…';
    try {
      const result = await fetchJson(`/courses/${courseId}`, { method: 'GET' });
      const course = result.data?.course || result;
      titleEl.textContent = course.title || course.courseName || 'Course detail';
      descriptionEl.textContent = course.description || 'No description available.';
      metaEl.innerHTML = `
        <strong>Department</strong>
        <p>${course.departmentId?.name || course.departmentId?.departmentName || 'Unknown'}</p>
        <strong>Duration</strong>
        <p>${course.duration ? `${course.duration} days` : 'N/A'}</p>
        <strong>Level</strong>
        <p>${course.level || 'N/A'}</p>
      `;
      extraEl.innerHTML = `
        <strong>Course ID</strong>
        <p>${course._id || course.id}</p>
        <strong>Instructor</strong>
        <p>${course.instructorId || 'Not assigned'}</p>
      `;
    } catch (error) {
      titleEl.textContent = 'Unable to load course';
      descriptionEl.textContent = error.message;
      metaEl.innerHTML = '';
      extraEl.innerHTML = '';
    }
  }

  async function loadExams() {
    if (!requireAuth()) return;
    const container = document.getElementById('examsContainer');
    if (!container) return;
    container.innerHTML = '<p>Loading exams…</p>';
    try {
      const result = await fetchJson('/course-exams', { method: 'GET' });
      const exams = result.data?.courseExams || result.courseExams || result;
      container.innerHTML = '';
      if (!exams || exams.length === 0) {
        container.innerHTML = '<p>No exams published yet.</p>';
        return;
      }
      exams.forEach((exam) => container.appendChild(renderExamCard(exam)));
    } catch (error) {
      container.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  function attachSignOut() {
    const signOutLink = document.getElementById('signOutLink');
    if (signOutLink) {
      signOutLink.addEventListener('click', (event) => {
        event.preventDefault();
        signOut();
      });
    }
  }

  attachSignOut();

  // Show an unobtrusive banner if the API health check fails (helps detect static server/API port conflicts)
  function showApiBanner(message) {
    let banner = document.getElementById('apiBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'apiBanner';
      banner.style.position = 'fixed';
      banner.style.left = '16px';
      banner.style.right = '16px';
      banner.style.bottom = '16px';
      banner.style.zIndex = '9999';
      banner.style.padding = '12px 16px';
      banner.style.borderRadius = '12px';
      banner.style.background = 'rgba(248, 215, 218, 0.95)';
      banner.style.color = '#842029';
      banner.style.boxShadow = '0 8px 30px rgba(15,23,42,0.08)';
      banner.style.fontSize = '0.95rem';
      document.body.appendChild(banner);
    }
    banner.textContent = message;
  }

  // Initial lightweight health check to detect wrong API host (returns helpful banner on failure)
  (async () => {
    try {
      // Derive API root (remove /api/vX if present) so we call the correct /health endpoint
      const apiBaseRaw = localStorage.getItem('frontendApiUrl') || 'http://localhost:3000/api/v1';
      const apiRoot = apiBaseRaw.replace(/\/api\/v\d+$/i, '').replace(/\/$/, '');
      const resp = await fetch(`${apiRoot}/health`);
      if (!resp.ok) throw new Error(`Health check failed (status ${resp.status})`);
      // parse JSON to ensure it's actually the backend
      await resp.json();
    } catch (err) {
      const advice = 'Unable to reach backend API. Ensure the backend is running (npm run dev) and that the frontend is served on a different port than the API. Set the API base in localStorage if needed: localStorage.setItem("frontendApiUrl", "http://localhost:3000/api/v1");';
      showApiBanner(`${err.message} — ${advice}`);
      console.warn('API health check failed:', err.message);
    }
  })();

  const page = document.body.dataset.page;
  if (page === 'dashboard') {
    if (requireAuth()) loadDashboard();
  }
  if (page === 'courses') {
    if (requireAuth()) loadCourses();
  }
  if (page === 'course-detail') {
    if (requireAuth()) loadCourseDetail();
  }
  if (page === 'exams') {
    if (requireAuth()) loadExams();
  }
  if (page === 'profile') {
    if (requireAuth()) renderProfile();
  }
});
