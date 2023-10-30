const express = require('express');
const router = express.Router();

const {
  listUsers,
  getOneUser,
  updateUser,
  deleteUserAdmin,
} = require('../controllers/admin');

const { authenticate } = require('../middleware/authenticate');

const nameValidation = require('../utils/validationUtils');

const authorize = require('../middleware/authorize');

router.get('/list-users', authenticate, authorize, listUsers);
router.get('/get-user/:id', authenticate, authorize, getOneUser);
router.post(
  '/update-user/:id',
  [
    nameValidation('givenName', 'First name'),
    nameValidation('familyName', 'Family Name'),
  ],
  authenticate,
  authorize,
  updateUser
);

router.post('/delete-user/:id', authenticate, authorize, deleteUserAdmin);

module.exports = router;
