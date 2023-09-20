const { sign } = require('jsonwebtoken');
const decodeTokenUserID = require('../utils/decodeTokenUserID');

const handleToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    let userID = decodeTokenUserID(accessToken, 'ACCESS');

    if (userID === null) {
      const refreshToken = req.cookies.refreshToken;
      userID = decodeTokenUserID(refreshToken, 'REFRESH');
      if (userID !== null) {
        const newAccessToken = sign(
          { id: userID },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'Lax',
        });
      } else {
        console.log('Error');
        //         return res.redirect(
        //   `${process.env.CLIENT_URL}/failed-token-validity?tokenExpired=true`
        // );
      }
    }
    req.userID = userID;
    next();
  } catch (error) {
    console.log('Error:', error);
    //         return res.redirect(
    //   `${process.env.CLIENT_URL}/failed-token-validity?tokenExpired=true`
    // );
  }
};

const authenticate = (req, res, next) => {
  handleToken(req, res, next);
};

const checkTokenPassport = (req, res, next) => {
  if (req.user.state !== null) {
    handleToken(req, res, next);
  } else {
    next();
  }
};

module.exports = { authenticate, checkTokenPassport };
