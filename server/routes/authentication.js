const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  authenticateOrCreateAccount,
  completeProfileSetup,
  synchronizeAccount,
} = require('../controllers/authentication');

const { passportStateOrTokenCheck } = require('../middleware/authenticate');

const nameValidation = require('../utils/validationUtils');

// Microsoft
router.get(
  '/auth/microsoft',
  passport.authenticate('microsoft', {
    prompt: 'select_account',
  })
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
  passportStateOrTokenCheck,
  authenticateOrCreateAccount,
  synchronizeAccount
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
  passportStateOrTokenCheck,
  authenticateOrCreateAccount,
  synchronizeAccount
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
  passportStateOrTokenCheck,
  authenticateOrCreateAccount,
  synchronizeAccount
);

router.post(
  '/complete-setup',
  [
    nameValidation('userInputData.givenName', 'First name'),
    nameValidation('userInputData.familyName', 'Family Name'),
  ],
  completeProfileSetup
);

router.post('/logout', (req, res) => {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .send('Cookies cleared');
});

module.exports = router;
