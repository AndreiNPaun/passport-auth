const authorize = (req, res, next) => {
  if (req.role !== 'owner' && req.role !== 'admin') {
    return res.status(401).send('Unauthorized access.');
  }

  next();
};

module.exports = authorize;
