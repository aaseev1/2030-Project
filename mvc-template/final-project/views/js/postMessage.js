(() => {
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
        event.preventDefault()
        titlesDropdown.innerHTML = ""
        let searchQuery = document.querySelector('#bookSearch').value
        const bookData = await postJsonData('/getBookTitles', searchQuery)
        let bookDataDocs = bookData.docs
        if(bookDataDocs){
            for(let i = 0; i < bookDataDocs.length && i < 100; i++){
                let option = document.createElement('option')
                option.text = bookDataDocs[i].title
                option.setAttribute('data-cover-id', bookDataDocs[i].cover_edition_key)
                titlesDropdown.appendChild(option)
            }
        }
        console.log(bookData)
    }

    const showBookContents = async () => {
        const selectedBook = String(titlesDropdown.value)
        let coverId = titlesDropdown.options[titlesDropdown.selectedIndex].getAttribute('data-cover-id')
        
        const bookData = await postJsonData('/getBookTitles', selectedBook)
        let bookDataDocs = bookData.docs
        if(bookDataDocs){
            let selectedBook;
            for(let i = 0; i < bookDataDocs.length && i < 100; i++){
                if(coverId === bookDataDocs[i].cover_edition_key){
                    selectedBook = bookDataDocs[i]
                }
            }
            if(!selectedBook){
                selectedBook = bookData.docs[0]
            }
            document.querySelector('#bookID').value = selectedBook.cover_edition_key
            document.querySelector('#author').value = selectedBook.author_name[0]
        }
    }

    window.onload = () => {
        document.querySelector('#bookSearchBtn').onclick = bookSearch
        titlesDropdown.onchange = showBookContents
    }
})()