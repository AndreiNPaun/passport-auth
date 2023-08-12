const { verify } = require('jsonwebtoken');

// Verifies token
const authenticate = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decode = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(401).send('Access Token Expired.');
    } else {
      console.log(error);
      res.status(500).send('Authentication failed.');
    }
  }
};

module.exports = authenticate;
