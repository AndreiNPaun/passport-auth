const { sign } = require('jsonwebtoken');
const decodeTokenUserID = require('./decodeTokenUserID');

const refreshTokenFunc = (accessToken, refreshToken, res) => {
  try {
    const userID = decodeTokenUserID(accessToken, 'ACCESS');

    if (userID instanceof Error) {
      console.log('error on decoding token');
      const userIDFromRefreshToken = decodeTokenUserID(refreshToken, 'REFRESH');
      console.log('REFEREDHS ROKEN', userIDFromRefreshToken);

      if (userIDFromRefreshToken instanceof Error) {
        console.log('Refresh token has expired.');
        // return res.redirect(process.env.CLIENT_URL);
        return;
      }

      const accessToken = sign(
        { id: userIDFromRefreshToken },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );

      const userID = decodeTokenUserID(accessToken, 'ACCESS');

      console.log('Newly generated accessToken:', accessToken);

      return { userID, accessToken };
    }

    return userID;
  } catch (error) {
    console.log('Error:', error);
    // return res.redirect(process.env.CLIENT_URL);
  }
};

module.exports = refreshTokenFunc;
