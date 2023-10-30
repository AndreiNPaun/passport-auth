const { sign } = require('jsonwebtoken');
const decodeToken = require('../utils/decodeToken');

const generateNewAccessToken = (userProfileData, res) => {
  const newAccessToken = sign(
    { id: userProfileData.id, role: userProfileData.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  return res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  });
};

const checkRefreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const userProfileData = decodeToken(refreshToken, 'REFRESH');

  // If refresh token is valid, then refresh access token
  if (userProfileData) {
    generateNewAccessToken(userProfileData, res);

    return userProfileData;
  } else {
    res.status(401).send('Access token error.');
  }
};

const authenticate = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    let userProfileData = decodeToken(accessToken, 'ACCESS');

    // If access token cannot be decoded, check the refresh token
    if (!userProfileData) {
      // Set userProfileData to ID and role decoded from refresh token
      userProfileData = checkRefreshToken(req, res);
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
  if (req.user.state) {
    authenticate(req, res, next);
  } else {
    next();
  }
};

module.exports = {
  authenticate,
  passportStateOrTokenCheck,
  generateNewAccessToken,
  checkRefreshToken,
};
