document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const forgotForm = document.getElementById('forgotForm');
  const apiBase = localStorage.getItem('frontendApiUrl') || 'http://localhost:3000/api/v1';

  const authTokenKey = 'elearningAuthToken';

  function getHeaders(isJson = true) {
    const headers = {};
    if (isJson) headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem(authTokenKey);
    if (token) headers.Authorization = token;
    return headers;
  }

  async function handleResponse(response) {
    const contentType = response.headers.get('content-type') || '';

    // If the response is JSON, parse it and handle errors normally
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        const message = data.message || data.error || 'Failed request';
        throw new Error(message);
      }
      return data;
    }

    // If server returned HTML or plain text, show a helpful error instead of a JSON parse failure
    const text = await response.text();
    const snippet = text ? text.slice(0, 300) : '';
    const statusNote = response.ok ? '' : ` (status ${response.status})`;
    throw new Error(`Expected JSON but server returned HTML/text${statusNote}: ${snippet}`);
  }

  async function submitForm(url, payload, isJson = true) {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(isJson),
      body: isJson ? JSON.stringify(payload) : payload
    });
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

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        email: loginForm.email.value.trim(),
        password: loginForm.password.value.trim()
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
          } else {
            window.location.href = 'dashboard.html';
          }
        } else {
        throw new Error('Login succeeded but token was missing.');
      }
      } catch (error) {
        alert(`Login failed: ${error.message}`);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: signupForm.name.value.trim(),
        email: signupForm.email.value.trim(),
        password: signupForm.password.value.trim(),
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
