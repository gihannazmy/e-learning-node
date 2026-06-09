document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const forgotForm = document.getElementById('forgotForm');

  function resolveApiBase() {
    const stored = localStorage.getItem('frontendApiUrl');
    if (stored) return stored.replace(/\/$/, '');
    return 'http://localhost:3000/api/v1';
  }

  const apiBase = resolveApiBase();
  const authTokenKey = 'elearningAuthToken';

  function getHeaders(isJson = true) {
    const headers = {};
    if (isJson) headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem(authTokenKey);
    if (token) headers.Authorization = token;
    return headers;
  }

  function formatFetchError(error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      return 'Cannot reach the API server. Run "npm run dev" for the backend and open the site at http://localhost:5000 (not as a local file).';
    }
    return error.message || 'Login failed';
  }

  async function handleResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || `Request failed (status ${response.status})`);
      }
      return text;
    }

    if (!response.ok) {
      const message = data.message || data.error || (Array.isArray(data.errors) && data.errors.join(', ')) || 'Failed request';
      throw new Error(message);
    }
    return data;
  }

  async function submitForm(url, payload, isJson = true) {
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(isJson),
        body: isJson ? JSON.stringify(payload) : payload
      });
    } catch (error) {
      throw new Error(formatFetchError(error));
    }
    return handleResponse(response);
  }

  async function loginUser(payload) {
    const url = `${apiBase}/users/login`;
    return submitForm(url, payload);
  }

  async function signupUser(payload) {
    const url = `${apiBase}/users/signup`;
    return submitForm(url, payload);
  }

  function requestPasswordReset() {
    return Promise.reject(new Error('Forgot password is not implemented in the backend yet.'));
  }

  const githubBtn = document.getElementById('githubBtn');
  if (githubBtn) githubBtn.addEventListener('click', () => {
    alert('OAuth flow placeholder');
  });

  if (window.location.protocol === 'file:') {
    console.warn('Open the frontend via http://localhost:5000 instead of opening HTML files directly.');
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        email: loginForm.email.value.trim(),
        password: loginForm.password.value
      };

      try {
        const result = await loginUser(payload);
      const token = result.token || result.data?.token;
      const user = result.data?.user || null;
        if (token) {
          localStorage.setItem(authTokenKey, `Bearer ${token}`);
          if (user) localStorage.setItem('elearningUser', JSON.stringify(user));
          alert('Login successful! Redirecting...');
          if (user && user.role === 'admin') {
            window.location.href = 'admin.html';
          } else if (user && user.role === 'instructor') {
            window.location.href = 'instructor-dashboard.html';
          } else {
            window.location.href = 'dashboard.html';
          }
        } else {
        throw new Error('Login succeeded but token was missing.');
      }
      } catch (error) {
        alert(`Login failed: ${formatFetchError(error)}`);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: signupForm.name.value.trim(),
        email: signupForm.email.value.trim(),
        password: signupForm.password.value,
        role: 'student'
      };

      try {
        const result = await signupUser(payload);
      const token = result.token || result.data?.token;
      const user = result.data?.user || null;
      if (token) {
        localStorage.setItem(authTokenKey, `Bearer ${token}`);
        if (user) localStorage.setItem('elearningUser', JSON.stringify(user));
        alert('Signup successful! Redirecting...');
        if (user && user.role === 'admin') {
          window.location.href = 'admin.html';
        } else if (user && user.role === 'instructor') {
          window.location.href = 'instructor-dashboard.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      } else {
        throw new Error('Signup succeeded but token was missing.');
      }
      } catch (error) {
        alert(`Signup failed: ${error.message}`);
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = forgotForm.email.value.trim();
      if (!email) {
        return alert('Please enter your email address.');
      }

      try {
        await requestPasswordReset(email);
        alert('If the email exists, reset instructions were sent.');
      } catch (error) {
        alert(`Reset request failed: ${error.message}`);
      }
    });
  }
});
