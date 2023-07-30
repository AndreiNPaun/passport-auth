const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users');

// Reusable redirect function which checks for the JWT Token
const userRedirect = (req, res) => {
  const token = req.user.token;
  const refreshToken = req.user.refreshToken;

  console.log('token route', token);

  // Checks if controller sent an error message
  const errorMessage = req.user.error;

  if (errorMessage) {
    console.log('taking user to form');
    // Pull out user fields

    const {
      givenName,
      familyName,
      email,
      providerType,
      providerID,
      extraParam,
    } = req.user;

    // Generate URL, if value is null or false unset url
    const givenNameUrl = givenName ? `&givenName=${givenName}` : '';
    const familyNameUrl = familyName ? `&familyName=${familyName}` : '';
    const emailUrl = email ? `&email=${email}` : '';

    // Extra param will have the syntax key+value and will be sent back to server as an extra db field if set
    const extraParamUrl = extraParam
      ? `&extraParam=${extraParam[0]}+${extraParam[1]}`
      : '';

    return res.redirect(
      `https://localhost:3000/user-form?provider=${providerType}&providerID=${providerID}${givenNameUrl}${familyNameUrl}${emailUrl}${extraParamUrl}`
    );
  }

  if (token && refreshToken) {
    console.log('Log In successful.');

    // Sets tokens as http cookie
    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .redirect('https://localhost:3000/login-check?isLoggedIn=true');
  } else {
    console.log('Log In failed.');
    res.status(401).redirect('https://localhost:3000');
  }
};

router.get('/', () => {
  console.log('homepage');
});

// GitHub
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['profile'] })
);

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    session: false,
  }),
  (req, res) => {
    userRedirect(req, res);
  }
);

// LinkedIn
router.get(
  '/auth/linkedin',
  passport.authenticate('linkedin', { scope: ['profile'] })
);

router.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    session: false,
  }),
  (req, res) => {
    userRedirect(req, res);
  }
);

// Google
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  (req, res) => {
    userRedirect(req, res);
  }
);

// Microsoft
router.get(
  '/auth/microsoft',
  passport.authenticate('microsoft', {
    prompt: 'select_account',
  })
);

router.get(
  '/auth/microsoft/callback',
  passport.authenticate('microsoft', {
    session: false,
  }),
  (req, res) => {
    userRedirect(req, res);
  }
);

router.post('/user-data', usersController.userData);

router.post('/refresh-token', usersController.refreshExpiredToken);

router.post('/logout', (req, res) => {
  res.clearCookie('token').clearCookie('refreshToken').send('Cookies cleared');
});

module.exports = router;
