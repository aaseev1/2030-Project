(() => {
  const { getDB } = require('../server/database');

  const sensitiveMethods = ['POST', 'PUT', 'DELETE'];
  const sensitiveRoutes = ['/api/films', '/api/books', '/api/reviews'];

  const createLogEntry = (user, req) => ({
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
    action: req.method,
    endpoint: req.originalUrl,
    timestamp: new Date(),
    ip: req.ip,
  });

  const accountabilityLogger = async (req, res, next) => {
    const isSensitive = sensitiveMethods.includes(req.method) &&
      sensitiveRoutes.some(route => req.url.startsWith(route));
    const user = req.session?.user;

    if (isSensitive && user) {
      try {
        const db = getDB();
        const logEntry = createLogEntry(user, req);
        await db.collection('logs').insertOne(logEntry);
      } catch (err) {
        console.error('❌ Failed to log action:', err.message);
        // Logging failure shouldn't block request
      }
    }

    next();
  };

  module.exports = accountabilityLogger;
})();
