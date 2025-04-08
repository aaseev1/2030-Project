
const config = {
    USE_LOCAL_DB: false, //toggle to false for global

    LOCAL_URI: 'mongodb://127.0.0.1:27017',
    LOCAL_DB_NAME: 'ReviewForum',
  
    SERVER: 'final-project.jhelliz.mongodb.net',
    USERNAME: 'akjcollege',
    PASSWORD: 'bgqaM6K3JWFYw6Aa',
    ATLAS_DB_NAME: 'final-project',
    SESSION_SECRET: 'your-session-secret',
  };
  
  config.MONGO_URI = config.USE_LOCAL_DB
    ? `${config.LOCAL_URI}/${config.LOCAL_DB_NAME}`
    : `mongodb+srv://${config.USERNAME}:${encodeURIComponent(config.PASSWORD)}@${config.SERVER}/?retryWrites=true&w=majority&appName=${config.ATLAS_DB_NAME}`;
  
  config.ACTIVE_DB_NAME = config.USE_LOCAL_DB ? config.LOCAL_DB_NAME : config.ATLAS_DB_NAME;
  
  module.exports = config;
  
//username: akjcollege
//password: bgqaM6K3JWFYw6Aa
//mongodb+srv://akjcollege:<db_password>@final-project.jhelliz.mongodb.net/?retryWrites=true&w=majority&appName=final-project