(() => {
  const role = sessionStorage.getItem('userRole');

  fetch('/books')
    .then(res => res.json())
    .then(data => {
      const reviewList = document.getElementById('review-list');

      data.forEach(review => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-dark', 'border-info', 'mb-3');

        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title text-info">${review.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">by ${review.author} • ⭐ ${review.rating}</h6>
            <p class="card-text">${review.review}</p>
            ${role === 'admin' ? `
              <button class="btn btn-sm btn-danger me-2" onclick="deleteReview('${review._id}')">Delete</button>
              <button class="btn btn-sm btn-secondary" onclick="editReview('${review._id}', \`${review.title}\`, \`${review.review}\`)">Edit</button>
            ` : ''}
          </div>
        `;

        reviewList.appendChild(card);
      });
    })
    .catch(err => console.error('Error fetching reviews:', err));
})();

function deleteReview(id) {
  if (!confirm('Are you sure you want to delete this review?')) return;

  fetch(`/books/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Review deleted');
      location.reload();
    })
    .catch(err => console.error('❌ Delete failed:', err));
}

function editReview(id, oldTitle, oldContent) {
  const newTitle = prompt('Update Title:', oldTitle);
  const newContent = prompt('Update Review:', oldContent);

  if (newTitle && newContent) {
    fetch(`/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, review: newContent })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Review updated!');
        location.reload();
      })
      .catch(err => console.error('❌ Edit failed:', err));
  }
}
