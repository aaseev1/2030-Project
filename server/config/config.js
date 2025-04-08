
const config = {
    USE_LOCAL_DB: false,
    LOCAL_URI: 'mongodb://127.0.0.1:27017',
    LOCAL_DB_NAME: 'ReviewForum',
  
    SERVER: 'cluster.eb6ot.mongodb.net',
    USERNAME: 'dbuser',
    PASSWORD: 'stackofmern',
    ATLAS_DB_NAME: 'Forum',
    SESSION_SECRET: '4f35@!f8#920fasdkljf0932j4!@#LJKDF$@!#$',

    OPEN_LIBRARY_API: 'https://openlibrary.org/search.json?q=',
    OPEN_LIBRARY_COVER_API: 'https://covers.openlibrary.org/b/olid/'
  };
  
  config.MONGO_URI = config.USE_LOCAL_DB
    ? `${config.LOCAL_URI}/${config.LOCAL_DB_NAME}`
    : `mongodb+srv://${config.USERNAME}:${config.PASSWORD}@${config.SERVER}/?retryWrites=true&w=majority&appName=${config.ATLAS_DB_NAME}`;
  
  config.ACTIVE_DB_NAME = config.USE_LOCAL_DB ? config.LOCAL_DB_NAME : config.ATLAS_DB_NAME;
  
  module.exports = config;
  