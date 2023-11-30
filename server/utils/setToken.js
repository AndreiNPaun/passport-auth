const { sign } = require('jsonwebtoken');

// Creates the JWT Tokens
const setToken = ({ _id, role }) => {
  try {
    if (_id === null || role === null) {
      throw new Error('ID and Role cannot be null.');
    }

    const accessToken = sign(
      { id: _id, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = sign(
      { id: _id, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      `An error occurred while creating tokens: ${error.message}`
    );
  }
};

module.exports = setToken;
