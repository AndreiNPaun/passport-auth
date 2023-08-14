const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  userData,
  getEditProfile,
  postEditProfile,
} = require('../controllers/users');
const { refreshExpiredToken } = require('../controllers/token');
const authenticate = require('../middleware/authenticate');
const userRedirect = require('../utils/userRedirect');
const { nameValidation, emailValidation } = require('../utils/validationUtils');

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

router.post(
  '/user-data',
  [
    nameValidation('userInputData.givenName', 'First name'),
    nameValidation('userInputData.familyName', 'Family Name'),
    emailValidation('userInputData.email'),
  ],
  userData
);

router.get('/edit-profile', authenticate, getEditProfile);
router.post(
  '/edit-profile',
  [
    nameValidation('userInputData.givenName', 'First name'),
    nameValidation('userInputData.familyName', 'Family Name'),
    emailValidation('userInputData.email'),
  ],
  authenticate,
  postEditProfile
);

router.post('/refresh-token', refreshExpiredToken);

router.post('/logout', (req, res) => {
  res.clearCookie('token').clearCookie('refreshToken').send('Cookies cleared');
});

module.exports = router;
