const { verify } = require('jsonwebtoken');

// Gets the user id from either the access or the refresh token
const decodeTokenUserID = (token, tokenType) => {
  try {
    let secret;
    switch (tokenType) {
      case 'ACCESS':
        secret = process.env.ACCESS_TOKEN_SECRET;
        break;
      case 'REFRESH':
        secret = process.env.REFRESH_TOKEN_SECRET;
        break;
      default:
        throw new Error('Invalid token type.');
    }

    const decoded = verify(token, secret);
    return decoded.id;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

module.exports = decodeTokenUserID;
