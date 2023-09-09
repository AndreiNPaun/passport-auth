const User = require('../models/users');
const { ObjectId } = require('mongodb');

const { setToken } = require('./token');
const decodeTokenUserID = require('../utils/decodeTokenUserID');
const validationError = require('../utils/validationError');

// Passport user registration function
const authentication = async ({
  givenName,
  familyName,
  email,
  providerType,
  providerID,
  extraParam,
}) => {
  try {
    const checkUser = await User.findOne({
      email: email,
    });

    // Checks if the email is stored in provider document
    const checkProvider = await User.findOne({
      [`provider.${providerType}.email`]: email,
    });

    // If user does not exist, create account
    if (!checkUser) {
      console.log('No user account found.');

      // Check if either field is empty and redirect the user to form to complete missing fields
      if (givenName === '' || familyName === '' || email === '') {
        console.log('User account fields are empty.');

        return {
          error: 'User account fields are empty.',
          givenName,
          familyName,
          email,
          providerType,
          providerID,
          extraParam,
        };
      }

      const newUserAccount = new User({
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
      });

      await newUserAccount.save();

      // Set Authentication Token and Refresh Token
      const jwtToken = setToken(newUserAccount);
      return jwtToken;
    }

    // Checks if user is registered but the chosen login provider details are not stored
    if (checkUser && !checkProvider) {
      console.log('Provider not registered.');

      await User.updateOne(
        { email },
        {
          $set: {
            [`provider.${providerType}.id`]: providerID,
            [`provider.${providerType}.givenName`]: givenName,
            [`provider.${providerType}.familyName`]: familyName,
            [`provider.${providerType}.email`]: email,
          },
        }
      );
    }

    // Set Authentication Token and Refresh Token
    const jwtToken = setToken(checkUser);
    return jwtToken;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// Controller which will amend user record based on user input
const userData = async (req, res, next) => {
  // Check for validation errors
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

  // Splitting params value into key value pairs
  const splitParams = extraParam.split(' ');
  const key = splitParams[0];
  const value = splitParams[1];

  try {
    // Check if there is an existing accounts with the same email
    const checkIfExistingUser = await User.findOne({ email });

    // If same email account exists update record
    if (checkIfExistingUser) {
      console.log('Synchronizing existing accounts.');

      await User.updateOne(
        { email },
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

      return res.status(200).send('Account synchronized.');
    }

    // If no account has this email, create a new record
    const newUserAccount = new User({
      givenName,
      familyName,
      email,
      provider: {
        [providerType]: {
          id: providerID,
          givenName,
          familyName,
          email,
          [key]: value,
        },
      },
    });

    const getUserDetails = await newUserAccount.save();

    const { accessToken, refreshToken } = setToken(getUserDetails);
    const isUserInput = true;

    req.user = { accessToken, refreshToken, isUserInput };
    next();
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Server Error.');
  }
};

const getEditProfile = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  const userID = decodeTokenUserID(accessToken, 'ACCESS');
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
    const accessToken = req.cookies.accessToken;

    const userID = decodeTokenUserID(accessToken, 'ACCESS');
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

const synchronizationRequest = async ({
  givenName,
  familyName,
  email,
  providerType,
  providerID,
  extraParam,
}) => {
  try {
    if (givenName === '' || familyName === '' || email === '') {
      console.log('User account fields are empty.');

      return {
        error: 'User account fields are empty.',
        sync: true,
        givenName,
        familyName,
        email,
        providerType,
        providerID,
        extraParam,
      };
    }

    await User.updateOne(
      { email },
      {
        $set: {
          [`provider.${providerType}.id`]: providerID,
          [`provider.${providerType}.givenName`]: givenName,
          [`provider.${providerType}.familyName`]: familyName,
          [`provider.${providerType}.email`]: email,
        },
      }
    );

    return 'synchronized';
  } catch (error) {
    console.log('Error', error);
  }
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

    const userID = decodeTokenUserID(accessToken, 'ACCESS');
    // Convert id to ObjectId
    const _id = new ObjectId(userID);

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
  authentication,
  userData,
  getEditProfile,
  postEditProfile,
  synchronizationRequest,
  synchronizingAccount,
};
