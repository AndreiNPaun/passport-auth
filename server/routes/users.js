const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  userData,
  getEditProfile,
  postEditProfile,
  synchronizingAccount,
} = require('../controllers/users');
const { refreshTokenCheck } = require('../controllers/token');
const authenticate = require('../middleware/authenticate');
const userRedirect = require('../utils/userRedirect');
const { nameValidation, emailValidation } = require('../utils/validationUtils');

router.get('/', () => {
  console.log('homepage');
});

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
    userRedirect(req, res, req.user.sync);
  }
);

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

// Route for setting up account in case fields are empty
router.post(
  '/user-data',
  [
    nameValidation('userInputData.givenName', 'First name'), // Reusable express-validator
    nameValidation('userInputData.familyName', 'Family Name'),
    emailValidation('userInputData.email'),
  ],
  userData,
  (req, res) => {
    userRedirect(req, res);
  }
);

// Edit account details
router.get('/edit-profile', authenticate, getEditProfile);
router.post(
  '/edit-profile',
  [
    nameValidation('userInputData.givenName', 'First name'), // Reusable express-validator
    nameValidation('userInputData.familyName', 'Family Name'),
    emailValidation('userInputData.email'),
  ],
  authenticate,
  postEditProfile
);

router.post(
  '/sync-account',
  [
    nameValidation('userInputData.givenName', 'First name'),
    nameValidation('userInputData.familyName', 'Family Name'),
    emailValidation('userInputData.email'),
  ],
  authenticate,
  synchronizingAccount
);

router.post('/refresh-token', refreshTokenCheck);

router.post('/logout', (req, res) => {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .send('Cookies cleared');
});

module.exports = router;
