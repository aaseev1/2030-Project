(() => {
  const { getDB } = require('../server/database');

  const accountabilityLogger = async (req, res, next) => {
    const db = getDB();
    const originalSend = res.send;

    res.send = async function (body) {
      const log = {
        timestamp: new Date(),
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        user: req.session?.user?.username || 'guest',
        role: req.session?.user?.role || 'guest',
        query: req.query || {},
      };

      try {
        await db.collection('logs').insertOne(log);
      } catch (err) {
        console.error('❌ Failed to log action:', err);
      }

      return originalSend.call(this, body);
    };

    next();
  };

  module.exports = accountabilityLogger;
})();