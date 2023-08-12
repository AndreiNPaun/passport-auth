const { verify } = require('jsonwebtoken');

// Verifies token
const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decode = verify(token, process.env.TOKEN_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(401).send('Token Expired.');
    } else {
      console.log(error);
      res.status(500).send('Authentication failed.');
    }
  }
};

module.exports = authenticate;
