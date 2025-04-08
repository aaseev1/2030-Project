(() => {
  const registerForm = document.getElementById('registerForm');
  const errorMsg = document.getElementById('error');

  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirm = document.getElementById('toggleConfirm');

  togglePassword?.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePassword.classList.toggle('bi-eye');
    togglePassword.classList.toggle('bi-eye-slash');
  });

  toggleConfirm?.addEventListener('click', () => {
    const isHidden = confirmInput.type === 'password';
    confirmInput.type = isHidden ? 'text' : 'password';
    toggleConfirm.classList.toggle('bi-eye');
    toggleConfirm.classList.toggle('bi-eye-slash');
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const role = document.getElementById('role').value;

    if (password.length < 8 || password.length > 20) {
      alert('⚠️ Password must be between 8 and 20 characters.');
      return;
    }

    if (password !== confirmPassword) {
      alert('⚠️ Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, role })
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Registration successful! You can now log in.');
        window.location.href = 'login.html';
      } else {
        errorMsg.textContent = result.error || 'Registration failed.';
      }
    } catch (err) {
      errorMsg.textContent = 'Something went wrong. Please try again.';
      console.error('❌ Registration Error:', err);
    }
  };

  registerForm.addEventListener('submit', handleRegister);
})();
