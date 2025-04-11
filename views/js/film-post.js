(() => {
  const role = sessionStorage.getItem('userRole');
  if (role !== 'member' && role !== 'admin') {
    showModal('⚠️ Only members can post film reviews. Please login.', () => {
      window.location.href = 'login.html';
    });
    return;
  }

  const form = document.getElementById('filmReviewForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      title: document.getElementById('title').value,
      review: document.getElementById('review').value,
      rating: document.getElementById('rating').value
    };

    try {
      const res = await fetch('/films', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        showModal('✅ Film review posted!', () => {
          window.location.href = 'film-read.html';
        });
      } else {
        showModal('❌ Error: ' + (result.error || 'Failed to post review'));
      }
    } catch {
      showModal('❌ Network error. Please try again later.');
    }
  });

  function showModal(message, callback = null) {
    const modalBody = document.getElementById('feedbackModalBody');
    modalBody.textContent = message;

    const modalElement = new bootstrap.Modal(document.getElementById('feedbackModal'));
    modalElement.show();

    const closeBtn = document.getElementById('modalCloseBtn');
    closeBtn.onclick = () => {
      modalElement.hide();
      if (typeof callback === 'function') callback();
    };
  }
})();
