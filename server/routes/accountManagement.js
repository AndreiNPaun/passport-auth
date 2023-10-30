const express = require('express');
const router = express.Router();

const {
  getEditProfile,
  postEditProfile,
  deleteProvider,
  deleteAccount,
  listUserProvider,
} = require('../controllers/accountManagement');

const { authenticate } = require('../middleware/authenticate');

const nameValidation = require('../utils/validationUtils');

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

router.get('/list-providers', authenticate, listUserProvider);
router.post('/delete-provider', authenticate, deleteProvider);

router.post('/delete-account', authenticate, deleteAccount);

module.exports = router;
