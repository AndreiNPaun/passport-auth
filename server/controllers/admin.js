const User = require('../models/user');

const validationError = require('../utils/validationError');

const listUsers = async (req, res, next) => {
  try {
    console.log('req.query', req.query);
    const { givenName, familyName, email, role } = req.query;

    const query = {};

    if (givenName) query.givenName = new RegExp(givenName, 'i');
    if (familyName) query.familyName = new RegExp(familyName, 'i');
    if (email) query.email = new RegExp(email, 'i');
    if (role) query.role = role;

    const users = await User.find(query);

    let filterAdminAccounts = users.filter((user) => user.role !== 'admin');

    if (req.role === 'moderator') {
      filterAdminAccounts = filterAdminAccounts.filter(
        (user) => user.role !== 'moderator'
      );
    }

    res.status(200).json(filterAdminAccounts);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Unexpected error.');
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Unexpected error.');
  }
};

const updateUser = async (req, res, next) => {
  if (validationError(req, res)) {
    return;
  }

  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, req.body);

    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.status(200).json(user);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Unexpected error.');
  }
};

const deleteUserAdmin = async (req, res, next) => {
  try {
    const userID = req.params.id;
    await User.findByIdAndDelete(userID);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Unexpected error.');
  }
};

module.exports = {
  listUsers,
  getOneUser,
  updateUser,
  deleteUserAdmin,
};
