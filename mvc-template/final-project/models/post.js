const Post = (bookId, title, author, message, by) => {
    return {
        BookID: bookId,
        Title: title,
        Author: author,
        Message: message,
        By: by,
        At: new Date().toUTCString()
    }
}
module.exports = Post
