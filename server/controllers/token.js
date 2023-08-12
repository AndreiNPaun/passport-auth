const { sign, verify } = require('jsonwebtoken');

// Creates the JWT Tokens
const setToken = (user) => {
  const token = sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });

  const refreshToken = sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return { token, refreshToken };
};

// Refresh Token
const refreshExpiredToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    // Checks if the refresh token has expired
    const checkRefreshToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // If refresh token is valid then another token will be generated
    const token = sign(
      { id: checkRefreshToken._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );

    console.log('Newly generated token:', token);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .send('Token refreshed.');
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
