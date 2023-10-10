const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  authenticateOrCreateAccount,
  completeProfileSetup,
  getEditProfile,
  postEditProfile,
  synchronizeAccount,
  listUserProvider,
  deleteProvider,
} = require('../controllers/users');

const {
  authenticate,
  checkTokenPassport,
} = require('../middleware/authenticate');

const nameValidation = require('../utils/validationUtils');

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
  checkTokenPassport,
  authenticateOrCreateAccount,
  synchronizeAccount
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
  checkTokenPassport,
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
  checkTokenPassport,
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
  checkTokenPassport,
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

router.get('/edit-profile', authenticate, getEditProfile);
router.post(
  '/edit-profile',
  [
    nameValidation('userInputData.givenName', 'First name'),
    nameValidation('userInputData.familyName', 'Family Name'),
  ],
  authenticate,
  postEditProfile
);

router.post('/logout', (req, res) => {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .send('Cookies cleared');
});

router.get('/list-providers', authenticate, listUserProvider);
router.post('/delete-provider', authenticate, deleteProvider);

module.exports = router;
