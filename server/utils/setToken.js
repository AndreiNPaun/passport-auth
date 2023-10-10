const { sign } = require('jsonwebtoken');

// Creates the JWT Tokens
const setToken = ({ _id }) => {
  const accessToken = sign({ id: _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = sign({ id: _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

module.exports = {
  setToken,
};
