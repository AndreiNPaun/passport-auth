const authorize = (req, res, next) => {
  if (req.role !== 'admin' && req.role !== 'moderator') {
    return res.status(401).send('Unauthorized access.');
  }

  next();
};

module.exports = authorize;
