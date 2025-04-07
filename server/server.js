(() => {
  const express = require('express');
  const session = require('express-session');
  const MongoStore = require('connect-mongo');
  const path = require('path');
  const accountabilityLogger = require('../middleware/accountability');
  const { connectDB } = require('./database');
  const config = require('./config/config');

  const app = express();
  const PORT = process.env.PORT || 3000;

  connectDB()
    .then(() => {
      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());
      app.use(accountabilityLogger);

      app.use(express.static(path.join(__dirname, '..', 'views')));

      app.use(session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: `mongodb+srv://${config.USERNAME}:${encodeURIComponent(config.PASSWORD)}@${config.SERVER}/?retryWrites=true&w=majority&appName=${config.DATABASE}`,
          dbName: config.DATABASE,
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 2 },
      }));

      const routes = require('./routes');
      app.use('/api', routes);
      app.use('/', routes);

      app.listen(PORT, () => {
        console.log(`\t Server running at http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Could not start server:', err.message);
      process.exit(1);
    });
})();