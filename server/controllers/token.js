const { sign, verify } = require('jsonwebtoken');
const decodeTokenUserID = require('../middleware/decodeTokenUserID');

// Creates the JWT Tokens
const setToken = (user) => {
  const accessToken = sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return { accessToken, refreshToken };
};

// Refresh Token
const refreshExpiredToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    // Checks if the refresh token has expired
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userID = decodeTokenUserID(refreshToken, 'REFRESH');
    console.log('id', userID);

    // If refresh token is valid then another token will be generated
    const accessToken = sign({ id: userID }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    console.log('Newly generated accessToken:', accessToken);

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .send('Access Token refreshed.');
  } catch (error) {
    // If then refresh token has expired display authentication error
    if (error.name === 'TokenExpiredError') {
      res.status(401).send('Refresh token has expired. Authentication failed.');
    } else {
      res.status(400).send(`An error has occured: ${error}`);
    }
  }
};

module.exports = {
  setToken,
  refreshExpiredToken,
};
