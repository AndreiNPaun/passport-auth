const { sign } = require('jsonwebtoken');
const decodeToken = require('../utils/decodeToken');

const handleToken = (req, res, next) => {
  let userProfileData;
  let userID;
  try {
    const accessToken = req.cookies.accessToken;
    userProfileData = decodeToken(accessToken, 'ACCESS');
    console.log('testing', userProfileData);

    if (userProfileData === null) {
      const refreshToken = req.cookies.refreshToken;
      userProfileData = decodeToken(refreshToken, 'REFRESH');
      console.log('tstong', userProfileData);

      if (userProfileData !== null) {
        userID = userProfileData.id;
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
        return res.status(401).send('Access token error.');
      }
    }
    userID = userProfileData.id;
    req.userID = userID;
    next();
  } catch (error) {
    console.log('Error:', error);
    return res.redirect(`${process.env.CLIENT_URL}`);
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
