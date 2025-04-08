(() => {
  const { getDB } = require('../server/database');

  const accountabilityLogger = async (req, res, next) => {
    const sensitiveMethods = ['POST', 'PUT', 'DELETE'];
    const sensitiveRoutes = ['/api/films'];

    const isSensitive = sensitiveMethods.includes(req.method) && sensitiveRoutes.some(route => req.url.startsWith(route));
    const user = req.session?.user;

    if (isSensitive && user) {
      try {
        const db = getDB();
        await db.collection('logs').insertOne({
          user: {
            id: user._id,
            name: user.name,
            role: user.role,
          },
          action: req.method,
          endpoint: req.originalUrl,
          timestamp: new Date(),
          ip: req.ip
        });
      } catch (err) {
        console.error('❌ Failed to log action:', err.message);
        // Don’t stop the request even if logging fails
      }
    }

    next();
  };

  module.exports = accountabilityLogger;
})();