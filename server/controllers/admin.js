const User = require('../models/user');

const validationError = require('../utils/validationError');

const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
};

const buildUserQuery = (req) => {
  const { givenName, familyName, email, role } = req.query;
  const query = {};

  if (givenName) query.givenName = new RegExp(escapeRegExp(givenName), 'i');
  if (familyName) query.familyName = new RegExp(escapeRegExp(familyName), 'i');
  if (email) query.email = new RegExp(escapeRegExp(email), 'i');
  if (role) query.role = role;

  return query;
};

const filterUsersByRole = (users, requesterRole) => {
  let filteredUsers = users.filter((user) => user.role !== 'owner');

  if (requesterRole === 'admin') {
    filteredUsers = filteredUsers.filter((user) => user.role !== 'admin');
  }

  return filteredUsers;
};

const listUsers = async (req, res, next) => {
  try {
    const query = buildUserQuery(req);
    const users = await User.find(query);
    const filteredUsers = filterUsersByRole(users, req.role);

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).send('Server Error.');
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Server Error.');
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
    res.status(500).send('Server Error.');
  }
};

const deleteUserAdmin = async (req, res, next) => {
  try {
    const userID = req.params.id;
    await User.findByIdAndDelete(userID);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).send('Server Error.');
  }
};

module.exports = {
  buildUserQuery,
  filterUsersByRole,
  listUsers,
  getOneUser,
  updateUser,
  deleteUserAdmin,
};
