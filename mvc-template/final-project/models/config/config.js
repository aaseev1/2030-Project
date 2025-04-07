(() => {
    const config = {}
    config.SERVER = 'cluster.eb6ot.mongodb.net'
    config.USERNAME = 'dbuser'
    config.PASSOWRD = 'stackofmern'
    config.DATABASE = 'Forum'
    config.OPEN_LIBRARY_API = 'https://openlibrary.org/search.json?q='
    config.OPEN_LIBRARY_COVER_API = 'https://covers.openlibrary.org/b/olid/'
    module.exports = config
})()