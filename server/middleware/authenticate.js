const { sign } = require('jsonwebtoken');
const decodeToken = require('../utils/decodeToken');

const authenticate = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    let userProfileData = decodeToken(accessToken, 'ACCESS');

    if (!userProfileData) {
      const refreshToken = req.cookies.refreshToken;
      userProfileData = decodeToken(refreshToken, 'REFRESH');

      if (userProfileData) {
        const newAccessToken = sign(
          { id: userProfileData.id, role: userProfileData.role },
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

    // Make userID available to all controllers
    req.userID = userProfileData.id;
    req.role = userProfileData.role;
    next();
  } catch (error) {
    console.log('Error:', error);
    return res.redirect(`${process.env.CLIENT_URL}`);
  }
};

const passportStateOrTokenCheck = (req, res, next) => {
  // If state is set in Passport.js, skip authenticate middleware
  console.log();
  if (req.user.state) {
    authenticate(req, res, next);
  } else {
    next();
  }
};

module.exports = { authenticate, passportStateOrTokenCheck };
