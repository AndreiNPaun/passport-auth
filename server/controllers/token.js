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
  try {
    // Checks if the token has expired
    const token = req.cookies.token;
    verify(token, process.env.TOKEN_SECRET);

    console.log('Token has not expired');
  } catch (error) {
    // If token has expired it will try to refresh it
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired.');

      try {
        // Checks if the refresh token has expired
        const refreshToken = req.cookies.refreshToken;
        const decodeRefreshToken = verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // If refresh token is valid then another token will be generated
        const token = sign(
          { id: decodeRefreshToken._id },
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
          console.log('Refresh token has expired. Authentication failed.');
        } else {
          console.log('Error:', error);
          res.status(400).send(`An error has occured: ${error}`);
        }
      }
    } else {
      // In case there is another authentication error send it
      console.log('Error:', error);
      res.status(500).send('Authentication failed.');
    }
  }
};

module.exports = {
  setToken,
  refreshExpiredToken,
};
