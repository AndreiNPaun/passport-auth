const { sign } = require('jsonwebtoken');
const decodeTokenUserID = require('./decodeTokenUserID');

const checkTokenValidity = (accessToken, refreshToken, res) => {
  try {
    const userID = decodeTokenUserID(accessToken, 'ACCESS');

    if (userID instanceof Error) {
      const userIDFromRefreshToken = decodeTokenUserID(refreshToken, 'REFRESH');

      if (userIDFromRefreshToken instanceof Error) {
        return { error: 'Refresh Token has expired.' };
      }

      const accessToken = sign(
        { id: userIDFromRefreshToken },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );

      const userID = decodeTokenUserID(accessToken, 'ACCESS');

      return { userID, accessToken };
    }

    return userID;
  } catch (error) {
    console.log('Error:', error);
    return res.redirect(
      `${process.env.CLIENT_URL}/failed-token-validity?tokenExpired=true`
    );
  }
};

const checkIfTokenExists = (req, res, next) => {
  if (!req.cookies.accessToken && !req.cookies.refreshToken) {
    // return res.redirect(
    //   `${process.env.CLIENT_URL}/failed-token-validity?tokenExpired=true`
    // );
  }

  next();
};

module.exports = { checkTokenValidity, checkIfTokenExists };
