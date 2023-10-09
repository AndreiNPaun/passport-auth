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

// Passport user registration function
const authenticateOrCreateUser = async (req, res, next) => {
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

      const key = (Array.isArray(extraParam) && extraParam[0]) || null;
      const value = (Array.isArray(extraParam) && extraParam[1]) || null;

      const checkUser = await User.findOne({
        [`provider.${providerType}`]: {
          $elemMatch: { id: providerID, email },
        },
      });

      // Checks if the email is stored in another record
      const checksIfProviderExists = await User.findOne({
        $or: [
          { 'provider.google': { $elemMatch: { id: providerID, email } } },
          { 'provider.github': { $elemMatch: { id: providerID, email } } },
          { 'provider.microsoft': { $elemMatch: { id: providerID, email } } },
          { 'provider.linkedin': { $elemMatch: { id: providerID, email } } },
        ],
      });

      // If user does not exist, create account
      if (!checkUser) {
        console.log('No user account found.');

        // Check if provider is set linked with another account
        if (checksIfProviderExists) {
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
          email,
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

        // Set Authentication Token and Refresh Token
        req.user = setToken(newUserAccount);
        return redirectSetTokens(req, res);
      }

      Object.assign(req.user, setToken(checkUser));
      return redirectSetTokens(req, res);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
  next();
};

// Controller which will amend user record based on user input
const syncOrCreateProfile = async (req, res, next) => {
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
    const newUserAccountData = {
      givenName,
      familyName,
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
      newUserAccountData.provider[providerType][key] = value;
    }

    const newUserAccount = new User(newUserAccountData);
    const getUserDetails = await newUserAccount.save();

    const { accessToken, refreshToken } = setToken(getUserDetails);
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

  // Convert id to ObjectId
  const _id = new ObjectId(userID);

  try {
    const user = await User.findOne({
      _id,
    });

    const userData = {
      givenName: user.givenName,
      familyName: user.familyName,
    };

    res.status(200).send(userData);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Server Error.');
  }
};

const postEditProfile = async (req, res, next) => {
  // Check for validation errors
  if (validationError(req, res)) {
    return;
  }
  try {
    const { givenName, familyName, email } = req.body.userInputData;

    const userID = req.userID;
    // Convert id to ObjectId
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

    setTimeout(() => {
      res.status(200).send('Account updated.');
    }, 1500);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Server Error.');
  }
};

const synchronizationRequest = async (req, res, next) => {
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
      console.log('sync in try block');
      const userID = req.userID;
      console.log('sync userid', userID);

      // Checks if the email is stored in provider document
      const checksIfProviderExists = await User.findOne({
        [`provider.${providerType}`]: { $elemMatch: { id: providerID } },
      });

      console.log('provbider', checksIfProviderExists);

      const _id = new ObjectId(userID);

      if (
        checksIfProviderExists &&
        _id.toString() !== checksIfProviderExists._id.toString()
      ) {
        console.log('Provider account is already linked to another account.');

        req.user.error = {
          error: 'Provider account is already linked to another account.',
        };

        return redirectWithError(req, res);
      }

      const newUserRecord = {
        id: providerID,
        givenName,
        familyName,
        email,
      };

      if (Array.isArray(extraParam) && extraParam.length === 2) {
        const [key, value] = extraParam;
        newUserRecord[key] = value;
      }

      if (checksIfProviderExists) {
        // Update the existing record if it exists
        await User.updateOne(
          { _id, [`provider.${providerType}.id`]: providerID },
          { $set: { [`provider.${providerType}.$`]: newUserRecord } }
        );
      } else {
        // Push a new record if it doesn't exist
        await User.updateOne(
          { _id },
          { $push: { [`provider.${providerType}`]: newUserRecord } }
        );
      }

      req.user = { synchronized: 'synchronized' };

      console.log('synched');
      return redirectSync(req, res);
    } catch (error) {
      console.log('weird error');
      console.log('Error', error);
      res.status(401).redirect(`${process.env.CLIENT_URL}/account-management`);
    }
  }
  next();
};

const listProviders = async (req, res, next) => {
  const userID = req.userID;

  console.log('userID', userID);

  const provider = req.query.provider.toLowerCase();

  console.log('provider', provider);

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
  authenticateOrCreateUser,
  syncOrCreateProfile,
  getEditProfile,
  postEditProfile,
  synchronizationRequest,
  listProviders,
  deleteProvider,
};
