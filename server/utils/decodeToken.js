const { verify } = require('jsonwebtoken');

// Gets the user id from either the access or the refresh token
const decodeToken = (token, tokenType) => {
  try {
    const tokenSecrets = {
      ACCESS: process.env.ACCESS_TOKEN_SECRET,
      REFRESH: process.env.REFRESH_TOKEN_SECRET,
      SETUP: process.env.SETUP_TOKEN_SECRET,
    };

    const secret = tokenSecrets[tokenType];

    if (!secret) {
      throw new Error(`Unsupported token type: ${tokenType}`);
    }

    const decoded = verify(token, secret);
    return decoded;
  } catch (error) {
    console.log('Error:', error);
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired.');
      throw new Error('Token expired.');
    }

    throw new Error(`Token verification has failed: ${error}`);
  }
};

module.exports = decodeToken;
