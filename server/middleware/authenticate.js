const { sign } = require('jsonwebtoken');

const decodeTokenUserID = require('../utils/decodeTokenUserID');

const authenticate = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decode = decodeTokenUserID(accessToken, 'ACCESS');

    req.user = decode;
    return next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;

      refreshAccessToken(req, res, refreshToken);
    } else {
      console.log(error);
    }
  }
};

// Another stuff for testing
const checkTokenPassport = (req, res, next) => {
  console.log('checking state sync', req.user.state);

  if (req.user.state !== null) {
    console.log('got inside the if');
    try {
      const accessToken = req.cookies.accessToken;
      console.log('cocl', accessToken);
      const decode = decodeTokenUserID(accessToken, 'ACCESS');

      req.user = decode;
      return next();
    } catch (error) {
      console.log('in err mode');
      if (error.name == 'TokenExpiredError') {
        const refreshToken = req.cookies.refreshToken;

        refreshAccessToken(req, res, refreshToken);
        return next();
      } else {
        console.log(error);
        //         return res.redirect(
        //   `${process.env.CLIENT_URL}/failed-token-validity?tokenExpired=true`
        // );
      }
    }
  }

  next();
};

// to move
const refreshAccessToken = (req, res, refreshToken) => {
  try {
    const userID = decodeTokenUserID(refreshToken, 'REFRESH');

    const newAccessToken = sign(
      { id: userID },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    req.cookies.accessToken = newAccessToken;
    req.user.userID = userID;

    console.log('refresh userID', req.user.userID);

    res.status(200).cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });
  } catch (error) {
    return res.redirect(
      `${process.env.CLIENT_URL}/failed-token-validity?tokenExpired=true`
    );
  }
};

module.exports = { authenticate, checkTokenPassport };
