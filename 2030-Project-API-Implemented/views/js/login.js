(() => {
  const loginForm = document.getElementById('loginForm');
  const errorMsg = document.getElementById('error');

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem('userRole', result.user.role);
        sessionStorage.setItem('username', result.user.username);
        sessionStorage.setItem('name', result.user.name);
        alert(`Login successful! Logged in as ${result.user.role}`);
        window.location.href = 'index.html';
      } else {
        errorMsg.textContent = result.error || 'Login failed.';
      }
    } catch (err) {
      errorMsg.textContent = 'Something went wrong. Please try again.';
      console.error(err);
    }
  };

  loginForm.addEventListener('submit', handleLogin);

  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.classList.toggle('bi-eye');
    togglePassword.classList.toggle('bi-eye-slash');
  });
})();
