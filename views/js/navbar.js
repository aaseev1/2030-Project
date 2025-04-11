(() => {
  const role = sessionStorage.getItem('userRole');
  const username = sessionStorage.getItem('username');
  const name = sessionStorage.getItem('name');

  const loginLink = document.getElementById('nav-login');
  const registerLink = document.getElementById('nav-register');
  const logoutLink = document.getElementById('nav-logout');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDisplay = document.getElementById('nav-user');
  const getStarted = document.getElementById('getStartedBtn');

  if (getStarted && (role === 'member' || role === 'admin')) {
    getStarted.classList.add('d-none');
  }

  if (role === 'member' || role === 'admin') {
    loginLink?.classList.add('d-none');
    registerLink?.classList.add('d-none');
    logoutLink?.classList.remove('d-none');

    if (userDisplay && name) {
      userDisplay.textContent = `Hi, ${name} (${role})`;
      userDisplay.classList.remove('d-none');
    }
  }

  if (logoutBtn && role) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/api/auth/logout');
      sessionStorage.clear();
      window.location.href = 'login.html';
    });
  }
  
})();
