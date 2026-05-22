document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const forgotForm = document.getElementById('forgotForm');

  function mockAuthSuccess() {
    // simple mock: redirect to dashboard.html
    window.location.href = 'dashboard.html';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        email: loginForm.email.value,
        password: loginForm.password.value,
        remember: !!document.getElementById('remember')?.checked
      };
      console.log('Login submitted', data);
      // Replace with real API call; for prototype, mock success
      mockAuthSuccess();
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Array.from(new FormData(signupForm).entries()).reduce((o,[k,v])=> (o[k]=v,o),{});
      console.log('Signup submitted', data);
      // Mock: redirect to dashboard after signup
      mockAuthSuccess();
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = forgotForm.email.value;
      console.log('Reset requested for', email);
      alert('If the email exists, a reset link was sent (prototype).');
    });
  }

  const githubBtn = document.getElementById('githubBtn');
  if (githubBtn) githubBtn.addEventListener('click', ()=> alert('OAuth flow placeholder'));
});
