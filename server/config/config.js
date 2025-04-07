
const config = {
    USE_LOCAL_DB: true,
    LOCAL_URI: 'mongodb://127.0.0.1:27017',
    LOCAL_DB_NAME: 'ReviewForum',
  
    SERVER: 'your-cluster.mongodb.net',
    USERNAME: 'your-username',
    PASSWORD: 'your-password',
    ATLAS_DB_NAME: 'your-db-name',
    SESSION_SECRET: 'your-session-secret'
  };
  
  config.MONGO_URI = config.USE_LOCAL_DB
    ? `${config.LOCAL_URI}/${config.LOCAL_DB_NAME}`
    : `mongodb+srv://${config.USERNAME}:${config.PASSWORD}@${config.SERVER}/?retryWrites=true&w=majority&appName=${config.ATLAS_DB_NAME}`;
  
  config.ACTIVE_DB_NAME = config.USE_LOCAL_DB ? config.LOCAL_DB_NAME : config.ATLAS_DB_NAME;
  
  module.exports = config;
  