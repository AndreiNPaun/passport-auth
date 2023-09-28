const User = require('../models/users');
const { ObjectId } = require('mongodb');

const { setToken } = require('./token');
const decodeToken = require('../utils/decodeToken');
const validationError = require('../utils/validationError');
const {
  redirectSetTokens,
  redirectSync,
  redirectWithError,
} = require('../utils/userRedirect');

// Passport user registration function
const authenticateOrRegisterUser = async (req, res, next) => {
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
        email: email,
      });

      // Checks if the email is stored in provider document
      const checksIfProviderExists = await User.findOne({
        [`provider.${providerType}`]: { $elemMatch: { id: providerID } },
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
              },
            ],
          },
        });

        await newUserAccount.save();

        // Set Authentication Token and Refresh Token
        req.user = setToken(newUserAccount);
        return redirectSetTokens(req, res);
      }

      // Checks if user is registered but the chosen login provider details are not stored
      if (checkUser && !checksIfProviderExists) {
        console.log('Provider not registered.');

        await User.updateOne(
          { email },
          {
            $push: {
              [`provider.${providerType}`]: {
                id: providerID,
                givenName,
                familyName,
                email,
                [key]: value,
              },
            },
          }
        );
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
const syncOrCreateRegisterProfile = async (req, res, next) => {
  // Check for validation errors
  if (validationError(req, res)) {
    return;
  }

  const { givenName, familyName } = req.body.userInputData;

  const userProfileData = decodeToken(req.cookies.initialSetup, 'SETUP');
  console.log('testing', userProfileData);

  if (!userProfileData) {
    console.log('Token expired.');
    return res.status(408).send('Request timed out, please try again.');
  }

  const email = userProfileData.email;
  const providerType = userProfileData.providerType;
  const providerID = userProfileData.providerID;
  const extraParam = userProfileData.extraParam;

  const key = extraParam[0];
  const value = extraParam[1];

  console.log('key', key);

  try {
    // Check if there is an existing accounts with the same id
    const checkIfExistingUser = await User.findOne({
      [`provider.${providerType}`]: { $elemMatch: { id: providerID } },
    });

    // If same email account exists update record
    if (checkIfExistingUser) {
      console.log('Synchronizing existing accounts.');

      const updateUserObject = {
        [`provider.${providerType}.$.id`]: providerID,
        [`provider.${providerType}.$.givenName`]: givenName,
        [`provider.${providerType}.$.familyName`]: familyName,
        [`provider.${providerType}.$.email`]: email,
      };

      if (key && value) {
        updateUserObject[`provider.${providerType}.$.${key}`] = value;
      }

      await User.updateOne(
        {
          [`provider.${providerType}`]: { $elemMatch: { id: providerID } },
        },
        {
          $set: updateUserObject,
        }
      );

      return res.status(200).send('Account synchronized.');
    }

    // If no account has this email, create a new record
    const newUserAccountData = {
      givenName,
      familyName,
      email,
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
      email: user.email,
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
          email,
        },
      }
    );

    res.status(200).send('Account updated.');
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

      console.log('iddd', _id);

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
      await User.updateOne(
        { _id },
        { $push: { [`provider.${providerType}`]: newUserRecord } }
      );

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

const synchronizingAccount = async (req, res, next) => {
  if (validationError(req, res)) {
    return;
  }

  const {
    givenName,
    familyName,
    email,
    provider: providerType,
    providerID,
    extraParam,
  } = req.body.userInputData;

  const accessToken = req.cookies.accessToken;

  // Splitting params value into key value pairs
  const splitParams = extraParam.split(' ');
  const key = splitParams[0];
  const value = splitParams[1];

  try {
    console.log('Synchronizing existing accounts.');

    const userProfileData = decodeToken(accessToken, 'ACCESS');
    // Convert id to ObjectId
    const _id = new ObjectId(userProfileData.id);

    await User.updateOne(
      { _id },
      {
        $set: {
          [`provider.${providerType}.id`]: providerID,
          [`provider.${providerType}.givenName`]: givenName,
          [`provider.${providerType}.familyName`]: familyName,
          [`provider.${providerType}.email`]: email,
          [`provider.${providerType}.${key}`]: value,
        },
      }
    );

    res.status(200).send('Accounts synchronized.');
  } catch (error) {
    console.log('Error:', error);
    res.status(401).send('Unauthorized access.');
  }
};

module.exports = {
  authenticateOrRegisterUser,
  syncOrCreateRegisterProfile,
  getEditProfile,
  postEditProfile,
  synchronizationRequest,
  synchronizingAccount,
};
