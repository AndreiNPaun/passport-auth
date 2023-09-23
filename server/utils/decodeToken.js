const { verify } = require('jsonwebtoken');

// Gets the user id from either the access or the refresh token
const decodeToken = (token, tokenType) => {
  try {
    let secret;
    switch (tokenType) {
      case 'ACCESS':
        secret = process.env.ACCESS_TOKEN_SECRET;
        break;
      case 'REFRESH':
        secret = process.env.REFRESH_TOKEN_SECRET;
        break;
      case 'SETUP':
        secret = process.env.SETUP_TOKEN_SECRET;
        break;
      default:
        throw new Error('Invalid token type.');
    }

    const decoded = verify(token, secret);
    return decoded;
  } catch (error) {
    console.log('Error:', error);
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired');
      return null;
    }
    console.log('Error:', error);
    throw error;
  }
};

module.exports = decodeToken;
