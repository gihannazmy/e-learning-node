/* Shared API utilities for the E-Learning frontend */
const ElearningAPI = (() => {
  const authTokenKey = 'elearningAuthToken';
  const userKey = 'elearningUser';
  const studentIdKey = 'elearningStudentId';

  function getApiBase() {
    return localStorage.getItem('frontendApiUrl') || 'http://localhost:3000/api/v1';
  }

  function getApiRoot() {
    return getApiBase().replace(/\/api\/v\d+$/i, '').replace(/\/$/, '');
  }

  function getHeaders(isJson = true) {
    const headers = {};
    if (isJson) headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem(authTokenKey);
    if (token) headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return headers;
  }

  async function handleResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      if (!response.ok) throw new Error(text || `Request failed (${response.status})`);
      return text;
    }
    if (!response.ok) {
      const message = data.message || data.error || (data.errors && data.errors.join(', ')) || 'Request failed';
      throw new Error(message);
    }
    return data;
  }

  async function fetchJson(path, options = {}) {
    const isJsonBody = options.body && options.json !== false;
    const response = await fetch(`${getApiBase()}${path}`, {
      ...options,
      headers: getHeaders(isJsonBody)
    });
    return handleResponse(response);
  }

  function normalizeList(result) {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data?.courseMedias)) return result.data.courseMedias;
    if (Array.isArray(result?.data?.courses)) return result.data.courses;
    if (Array.isArray(result?.data?.courseExams)) return result.data.courseExams;
    if (Array.isArray(result?.users)) return result.users;
    if (Array.isArray(result?.courses)) return result.courses;
    if (Array.isArray(result?.courseExams)) return result.courseExams;
    if (result?.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
      const values = Object.values(result.data);
      if (values.length && values.every(Array.isArray)) return values.flat();
    }
    return [];
  }

  function loadUser() {
    const raw = localStorage.getItem(userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveUser(user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  }

  function getStudentId() {
    return localStorage.getItem(studentIdKey) || loadUser()?.id || loadUser()?._id || null;
  }

  function setStudentId(id) {
    if (id) localStorage.setItem(studentIdKey, id);
  }

  function requireAuth() {
    if (!localStorage.getItem(authTokenKey)) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  function requireRole(roles) {
    if (!requireAuth()) return false;
    const user = loadUser();
    if (!user || !roles.includes(user.role)) {
      window.location.href = user?.role === 'admin' ? 'admin.html' : 'dashboard.html';
      return false;
    }
    return true;
  }

  function signOut() {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem(studentIdKey);
    window.location.href = 'index.html';
  }

  function getQueryValue(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  function getCourseTitle(course) {
    return course?.title || course?.courseName || 'Untitled course';
  }

  function getCourseMongoId(course) {
    return course?._id || course?.id || null;
  }

  function matchesCourseId(item, courseRef) {
    if (!item || !courseRef) return false;
    const courseMongo = getCourseMongoId(courseRef);
    const courseNumeric = courseRef.courseId;
    const itemCourse = item.courseId;
    if (itemCourse && typeof itemCourse === 'object') {
      return getCourseMongoId(itemCourse) === courseMongo || itemCourse.courseId === courseNumeric;
    }
    return String(itemCourse) === String(courseMongo)
      || String(itemCourse) === String(courseNumeric)
      || itemCourse === courseRef._id;
  }

  function matchesExamId(question, exam) {
    if (!question || !exam) return false;
    const examMongo = exam._id || exam.id;
    const examNumeric = exam.examId;
    const ref = question.courseExamId ?? question.examId;
    if (ref && typeof ref === 'object') {
      return (ref._id || ref.id) === examMongo || ref.examId === examNumeric;
    }
    return String(ref) === String(examMongo) || String(ref) === String(examNumeric);
  }

  function showMessage(container, message, type = 'info') {
    if (!container) return;
    container.innerHTML = `<div class="info-message ${type}">${message}</div>`;
  }

  function showToast(message, type = 'info') {
    let toast = document.getElementById('siteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.className = 'site-toast';
      document.body.appendChild(toast);
    }
    toast.className = `site-toast site-toast--${type}`;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.hidden = true;
    }, 4000);
  }

  function renderNav(activePage) {
    const user = loadUser();
    const role = user?.role || 'student';
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    const links = [
      { href: 'landing.html', label: 'Home', roles: ['student', 'instructor', 'admin'], key: 'home' },
      { href: 'dashboard.html', label: 'Dashboard', roles: ['student'], key: 'dashboard' },
      { href: 'instructor-dashboard.html', label: 'Instructor', roles: ['instructor'], key: 'instructor' },
      { href: 'admin.html', label: 'Admin', roles: ['admin'], key: 'admin' },
      { href: 'courses.html', label: 'Courses', roles: ['student', 'instructor'], key: 'courses' },
      { href: 'exams.html', label: 'Exams', roles: ['student', 'instructor'], key: 'exams' },
      { href: 'exam-results.html', label: 'Results', roles: ['student', 'instructor'], key: 'results' },
      { href: 'profile.html', label: 'Profile', roles: ['student', 'instructor', 'admin'], key: 'profile' }
    ];

    nav.innerHTML = links
      .filter((link) => link.roles.includes(role))
      .map((link) => `<a class="nav-link${activePage === link.key ? ' active' : ''}" href="${link.href}">${link.label}</a>`)
      .join('')
      + `<a class="nav-link" href="#" id="signOutLink">Sign out</a>`;

    const signOutLink = document.getElementById('signOutLink');
    if (signOutLink) {
      signOutLink.addEventListener('click', (event) => {
        event.preventDefault();
        signOut();
      });
    }

    const userLabel = document.getElementById('navUserName');
    if (userLabel && user) userLabel.textContent = user.name || 'User';
  }

  async function checkHealth() {
    try {
      const resp = await fetch(`${getApiRoot()}/health`);
      if (!resp.ok) throw new Error(`Health check failed (${resp.status})`);
      await resp.json();
      return true;
    } catch (err) {
      showApiBanner(`${err.message} — Start the backend with npm run dev and serve frontend on port 5000.`);
      return false;
    }
  }

  function showApiBanner(message) {
    let banner = document.getElementById('apiBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'apiBanner';
      banner.className = 'api-banner';
      document.body.appendChild(banner);
    }
    banner.textContent = message;
  }

  return {
    authTokenKey,
    userKey,
    studentIdKey,
    getApiBase,
    getApiRoot,
    getHeaders,
    fetchJson,
    normalizeList,
    loadUser,
    saveUser,
    getStudentId,
    setStudentId,
    requireAuth,
    requireRole,
    signOut,
    getQueryValue,
    getCourseTitle,
    getCourseMongoId,
    matchesCourseId,
    matchesExamId,
    showMessage,
    showToast,
    renderNav,
    checkHealth
  };
})();
