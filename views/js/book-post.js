(() => {
  const role = sessionStorage.getItem('userRole');
  if (role !== 'member' && role !== 'admin') {
    showModal('⚠️ Only members can post reviews. Please login.', () => {
      window.location.href = 'login.html';
    });
    return;
  }

  const form = document.getElementById('bookReviewForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookCover = document.getElementById('bookID').value;
    let imageSrc = '';
    if(bookCover && bookCover !== ''){
      const link = await fetch(`/getBookCover/${bookCover}-S.jpg`);
      const data = await link.json();
      imageSrc = data.coverUrl;
    }

    const data = {
      title: document.getElementById('bookTitles').value,
      image: imageSrc,
      creator: document.getElementById('author').value,
      review: document.getElementById('review').value,
      rating: document.getElementById('rating').value
    };
    

    try {
      const res = await fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        showModal('✅ Book review posted!', () => {
          window.location.href = 'book-read.html';
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

  let titlesDropdown = document.querySelector('#bookTitles')

  const postJsonData = async (url, searchQuery) => {
      const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
              query: searchQuery
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      })
      const data = await response.json()
      return data
  }
  const bookSearch = async (event) => {
      event.preventDefault();

      titlesDropdown.innerHTML = "";
      let loading = document.createElement('option');
      loading.text = "Getting Book Titles...";
      titlesDropdown.appendChild(loading);

      let searchQuery = document.querySelector('#bookSearch').value;
      const bookData = await postJsonData('/getBookTitles', searchQuery);
      let bookDataDocs = bookData.docs;
      titlesDropdown.innerHTML = "";
      if(bookDataDocs){
        for(let i = 0; i < bookDataDocs.length && i < 100; i++){
          let option = document.createElement('option');
          option.text = bookDataDocs[i].title;
          option.setAttribute('data-cover-id', bookDataDocs[i].cover_edition_key);
          titlesDropdown.appendChild(option);
        }
      }
      // console.log(bookData)

      await showBookContents()
  }

  const showBookContents = async () => {
      const selectedBook = String(titlesDropdown.value);
      let coverId = titlesDropdown.options[titlesDropdown.selectedIndex].getAttribute('data-cover-id');
      document.querySelector('#author').value = "Getting author...";
      
      const bookData = await postJsonData('/getBookTitles', selectedBook);
      let bookDataDocs = bookData.docs;
      if(bookDataDocs){
          let selectedBookInfo;
          for(let i = 0; i < bookDataDocs.length && i < 100; i++){
              if(coverId === bookDataDocs[i].cover_edition_key){
                selectedBookInfo = bookDataDocs[i];
              }
          }

          if(!selectedBookInfo){
            for(let i = 0; i < bookDataDocs.length && i < 100; i++){
              if(selectedBook === bookDataDocs[i].title){
                selectedBookInfo = bookDataDocs[i];
              }
            }
          }
          
          if(!selectedBookInfo.cover_edition_key){
            document.querySelector('#bookID').value = "";
          }else{
            document.querySelector('#bookID').value = selectedBookInfo.cover_edition_key;
            console.log(selectedBookInfo.cover_edition_key)
          }
          document.querySelector('#author').value = selectedBookInfo.author_name[0];
      }
  }

  window.onload = () => {
      document.querySelector('#bookSearchBtn').onclick = bookSearch
      titlesDropdown.onchange = showBookContents
  }
})();
