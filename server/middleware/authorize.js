const authorize = (req, res, next) => {
  console.log('role', req.role);

  if (req.role !== 'admin' && req.role !== 'moderator') {
    return res.status(401).send('Unauthorized access.');
  }

  next();
};

module.exports = authorize;
