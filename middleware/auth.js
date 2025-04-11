(() => {
  const isMember = (req, res, next) => {
    const user = req.session?.user;
    if (user?.role === 'member' || user?.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Only logged in members can post reviews' });
  };

  const isAdmin = (req, res, next) => {
    const user = req.session?.user;
    if (user?.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Only admins can perform this action' });
  };

  module.exports = { isMember, isAdmin };
})();
