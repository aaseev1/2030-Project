(() => {
  const { MongoClient } = require('mongodb');
  const config = require('./config/config');
  
  const password = encodeURIComponent(config.PASSWORD);
  const uri = config.USE_LOCAL_DB
    ? `${config.LOCAL_URI}/${config.LOCAL_DB_NAME}`
    : `mongodb+srv://${config.USERNAME}:${password}@${config.SERVER}/?retryWrites=true&w=majority&appName=${config.ATLAS_DB_NAME}`;
    
  const client = new MongoClient(config.MONGO_URI);
  let db;
  
  const connectDB = async () => {
    try {
      await client.connect();
      db = client.db(config.ACTIVE_DB_NAME);
      console.log(`\t ✅ Connected to MongoDB (${config.USE_LOCAL_DB ? 'Local' : 'Atlas'})`);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      process.exit(1);
    }
  };
  
  const getDB = () => {
    if (!db) {
      throw new Error('❌ Database not connected. Did you forget to call connectDB()?');
    }
    return db;
  };
  
  module.exports = { connectDB, getDB };
  })();