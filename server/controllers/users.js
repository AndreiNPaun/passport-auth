const User = require('../models/users');
const { ObjectId } = require('mongodb');

const { setToken } = require('../utils/setToken');
const decodeToken = require('../utils/decodeToken');
const validationError = require('../utils/validationError');
const {
  redirectSetTokens,
  redirectSync,
  redirectWithError,
} = require('../utils/userRedirect');

const authenticateOrCreateAccount = async (req, res, next) => {
  if (req.user.state === null) {
    try {
      const {
        givenName,
        familyName,
        email,
        providerType,
        providerID,
        extraParam,
      } = req.user;

      // Extra param set in passport middleware
      const key = (Array.isArray(extraParam) && extraParam[0]) || null;
      const value = (Array.isArray(extraParam) && extraParam[1]) || null;

      // Looks for existing record stored under a providerType (Microsoft)
      const existingProvider = await User.findOne({
        [`provider.${providerType}`]: {
          $elemMatch: { id: providerID, email },
        },
      });

      // Looks for any record matching id and email
      const existingProviderRecord = await User.findOne({
        $or: [
          { 'provider.google': { $elemMatch: { id: providerID, email } } },
          { 'provider.github': { $elemMatch: { id: providerID, email } } },
          { 'provider.microsoft': { $elemMatch: { id: providerID, email } } },
          { 'provider.linkedin': { $elemMatch: { id: providerID, email } } },
        ],
      });

      if (!existingProvider) {
        console.log('No user account found.');

        if (existingProviderRecord) {
          console.log('Provider account is already linked to another account.');

          req.user.error = {
            error: 'Provider account is already linked to another account.',
          };

          return redirectWithError(req, res);
        }

        if (email === '') {
          console.log('Email cannot be retrieved.');

          req.user.error = {
            error: 'Email cannot be retrieved.',
            email: '',
            providerType,
          };

          return redirectWithError(req, res);
        }

        // Check if either field is empty and redirect the user to form to complete missing fields
        if (givenName === '' || familyName === '') {
          console.log('User account fields are empty.');

          req.user.error = {
            error: 'User account name fields are empty.',
            givenName,
            familyName,
            email,
            providerType,
            providerID,
            extraParam,
          };

          return redirectWithError(req, res);
        }

        const newUserAccount = new User({
          givenName,
          familyName,
          role: 'guest',
          provider: {
            [providerType]: [
              {
                id: providerID,
                givenName,
                familyName,
                email,
                [key]: value,
              },
            ],
          },
        });

        await newUserAccount.save();

        req.user = setToken(newUserAccount);
        return redirectSetTokens(req, res);
      }

      Object.assign(req.user, setToken(existingProvider));
      return redirectSetTokens(req, res);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
  next();
};

const completeProfileSetup = async (req, res, next) => {
  if (validationError(req, res)) {
    return;
  }

  const { givenName, familyName } = req.body.userInputData;

  const userProfileData = decodeToken(req.cookies.initialSetup, 'SETUP');
  console.log('testing', userProfileData);

  const email = userProfileData.email;
  const providerType = userProfileData.providerType;
  const providerID = userProfileData.providerID;
  const extraParam = userProfileData.extraParam;

  const key = extraParam[0];
  const value = extraParam[1];

  try {
    const newAccountData = {
      givenName,
      familyName,
      role: 'guest',
      provider: {
        [providerType]: {
          id: providerID,
          givenName,
          familyName,
          email,
        },
      },
    };

    if (key && value) {
      newAccountData.provider[providerType][key] = value;
    }

    const newAccount = new User(newAccountData);
    const createdUser = await newAccount.save();

    const { accessToken, refreshToken } = setToken(createdUser);

    // isUserInput flags the redirect to navigate to complete-setup page
    const isUserInput = true;

    req.user = { accessToken, refreshToken, isUserInput };
    console.log('redirecting');
    return redirectSetTokens(req, res);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Server Error.');
  }
};

const getEditProfile = async (req, res, next) => {
  const userID = req.userID;

  const _id = new ObjectId(userID);

  try {
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
    console.log('Error:', error);
    res.status(500).send('Server Error.');
  }
};

const postEditProfile = async (req, res, next) => {
  if (validationError(req, res)) {
    return;
  }
  try {
    const { givenName, familyName } = req.body.userInputData;

    const userID = req.userID;

    const _id = new ObjectId(userID);

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
    console.log('Error:', error);
    res.status(500).send('Server Error.');
  }
};

const synchronizeAccount = async (req, res, next) => {
  if (req.user.state === 'sync') {
    const {
      givenName,
      familyName,
      email,
      providerType,
      providerID,
      extraParam,
    } = req.user;

    try {
      const userID = req.userID;

      // Check if the provider's ID already exists for the specified provider type
      const existingProvider = await User.findOne({
        [`provider.${providerType}`]: { $elemMatch: { id: providerID } },
      });

      const _id = new ObjectId(userID);

      // Ensure that the found provider's account isn't linked with another user
      if (
        existingProvider &&
        _id.toString() !== existingProvider._id.toString()
      ) {
        console.log('Provider account is already linked to another account.');

        req.user.error = {
          error: 'Provider account is already linked to another account.',
        };

        return redirectWithError(req, res);
      }

      const providerAccountData = {
        id: providerID,
        givenName,
        familyName,
        email,
      };

      // If extra parameters are provided, add them to the provider account data
      if (Array.isArray(extraParam) && extraParam.length === 2) {
        const [key, value] = extraParam;
        providerAccountData[key] = value;
      }

      if (existingProvider) {
        // Update existing provider data
        await User.updateOne(
          { _id, [`provider.${providerType}.id`]: providerID },
          { $set: { [`provider.${providerType}.$`]: providerAccountData } }
        );
      } else {
        // Insert new provider data
        await User.updateOne(
          { _id },
          { $push: { [`provider.${providerType}`]: providerAccountData } }
        );
      }

      redirectSync(req, res);
    } catch (error) {
      console.log('weird error');
      console.log('Error', error);
      res.status(401).redirect(`${process.env.CLIENT_URL}/account-management`);
    }
  }
  next();
};

const listUserProvider = async (req, res, next) => {
  const userID = req.userID;

  const provider = req.query.provider.toLowerCase();

  try {
    const userProviders = await User.findById(userID).select(
      `provider.${provider}`
    );

    console.log('result', userProviders);

    res.status(200).send(userProviders.provider[provider]);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Unexpected error.');
  }
};

const deleteProvider = async (req, res, next) => {
  const userID = req.userID;
  const _id = new ObjectId(userID);

  const providerID = req.body.providerID;
  const providerType = req.body.providerType.toLowerCase();

  try {
    await User.updateOne(
      { _id },
      { $pull: { [`provider.${providerType}`]: { id: providerID } } }
    );

    res.status(200).send('Provider connection removed successfully.');
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Error while removing the provider connection.');
  }
};

module.exports = {
  authenticateOrCreateAccount,
  completeProfileSetup,
  getEditProfile,
  postEditProfile,
  synchronizeAccount,
  listUserProvider,
  deleteProvider,
};
