const User = require('../models/user');
const { ObjectId } = require('mongodb');

const validationError = require('../utils/validationError');

const convertIDToObjectID = (userID) => {
  const _id = new ObjectId(userID);
  return _id;
};

const getEditProfile = async (req, res, next) => {
  try {
    const _id = convertIDToObjectID(req.userID);

    const user = await User.findOne({
      _id,
    });

    const userData = {
      givenName: user.givenName,
      familyName: user.familyName,
      role: user.role,
    };

    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send('Server Error.');
  }
};

const postEditProfile = async (req, res, next) => {
  if (validationError(req, res)) {
    return;
  }

  try {
    const { givenName, familyName } = req.body.userInputData;

    const _id = convertIDToObjectID(req.userID);

    await User.updateOne(
      { _id },
      {
        $set: {
          givenName,
          familyName,
        },
      }
    );

    res.status(200).send('Account updated.');
  } catch (error) {
    res.status(500).send('Server Error.');
  }
};

const listUserProvider = async (req, res, next) => {
  const userID = req.userID;
  const provider = req.query.provider.toLowerCase();

  try {
    const userProviders = await User.findById(userID).select(
      `provider.${provider}`
    );

    res.status(200).send(userProviders.provider[provider]);
  } catch (error) {
    res.status(500).send('Server Error.');
  }
};

const deleteProvider = async (req, res, next) => {
  const _id = convertIDToObjectID(req.userID);

  const providerID = req.body.providerID;
  const providerType = req.body.providerType.toLowerCase();

  try {
    await User.updateOne(
      { _id },
      { $pull: { [`provider.${providerType}`]: { id: providerID } } }
    );

    res.status(200).send('Provider connection removed successfully.');
  } catch (error) {
    res.status(500).send('Server Error.');
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userID = req.userID;
    await User.findByIdAndDelete(userID);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).send('Server Error.');
  }
};

module.exports = {
  convertIDToObjectID,
  getEditProfile,
  postEditProfile,
  listUserProvider,
  deleteProvider,
  deleteAccount,
};
