const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  authenticateOrRegisterUser,
  syncOrCreateRegisterProfile,
  getEditProfile,
  postEditProfile,
  synchronizationRequest,
  listProviders,
  deleteProvider,
} = require('../controllers/users');

const {
  authenticate,
  checkTokenPassport,
} = require('../middleware/authenticate');

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
  checkTokenPassport,
  authenticateOrRegisterUser,
  synchronizationRequest
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
  authenticateOrRegisterUser,
  synchronizationRequest
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
  authenticateOrRegisterUser,
  synchronizationRequest
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
  authenticateOrRegisterUser,
  synchronizationRequest
);

router.post(
  '/user-data',
  [
    nameValidation('userInputData.givenName', 'First name'),
    nameValidation('userInputData.familyName', 'Family Name'),
  ],
  syncOrCreateRegisterProfile
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

router.post('/logout', (req, res) => {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .send('Cookies cleared');
});

router.get('/list-providers', authenticate, listProviders);
router.post('/delete-provider', authenticate, deleteProvider);

module.exports = router;
