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

const providerAccountsNumber = async (_id) => {
  const user = await User.findOne({ _id });

  const providers = ['google', 'github', 'microsoft', 'linkedin'];

  let totalLinkedAccounts = 0;
  providers.forEach((provider) => {
    if (user.provider[provider] && Array.isArray(user.provider[provider])) {
      totalLinkedAccounts += user.provider[provider].length;
    }
  });

  return totalLinkedAccounts;
};

const deleteProvider = async (req, res, next) => {
  const _id = convertIDToObjectID(req.userID);

  const providerID = req.body.providerID;
  const providerType = req.body.providerType.toLowerCase();

  try {
    const totalLinkedAccounts = await providerAccountsNumber(_id);

    // Check if the user has only one provider
    if (totalLinkedAccounts <= 1) {
      return res
        .status(400)
        .send(
          'Cannot delete linked provider as it is the only one linked to the account.'
        );
    }

    await User.updateOne(
      { _id },
      { $pull: { [`provider.${providerType}`]: { id: providerID } } }
    );

    res.status(200).send('Provider connection removed successfully.');
  } catch (error) {
    console.log('err', error);
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
  providerAccountsNumber,
  deleteProvider,
  deleteAccount,
};
