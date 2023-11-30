const User = require('../models/user');
const { ObjectId } = require('mongodb');

const setToken = require('../utils/setToken');
const decodeToken = require('../utils/decodeToken');
const validationError = require('../utils/validationError');
const {
  redirectSetTokens,
  redirectSync,
  redirectWithError,
} = require('../utils/userRedirect');

const checkIfProviderExists = async (providerType, providerID, email) => {
  // Looks for existing record stored under a providerType (Microsoft)
  return await User.findOne({
    [`provider.${providerType}`]: {
      $elemMatch: { id: providerID, email },
    },
  });
};

const checkIfRecordExists = async (providerID, email) => {
  // Looks for any record matching id and email
  return await User.findOne({
    $or: [
      { 'provider.google': { $elemMatch: { id: providerID, email } } },
      { 'provider.github': { $elemMatch: { id: providerID, email } } },
      { 'provider.microsoft': { $elemMatch: { id: providerID, email } } },
      { 'provider.linkedin': { $elemMatch: { id: providerID, email } } },
    ],
  });
};

const authErrorRedirect = (req, res, errorValues) => {
  req.user.error = errorValues;

  return redirectWithError(req, res);
};

const setRoleForEmailDomain = (email) => {
  const role = email.endsWith(process.env.EMAIL_DOMAIN) ? 'admin' : 'guest';
  return role;
};

const setUserInformation = (userInfo) => {
  const { givenName, familyName, providerType, providerID, email, extraParam } =
    userInfo;

  const role = setRoleForEmailDomain(email);

  const newAccountData = {
    givenName,
    familyName,
    role,
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
  };

  // Set any extra parameter passed as key value pair
  if (extraParam) {
    const key = extraParam[0];
    const value = extraParam[1];

    newAccountData.provider[providerType][0][key] = value;
  }

  return newAccountData;
};

const createUserAccount = async (userProfileData) => {
  const newAccountData = setUserInformation(userProfileData);

  const newAccount = await new User(newAccountData).save();

  return newAccount;
};

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

      // Looks for existing record stored under a providerType (Microsoft)
      const existingProvider = await checkIfProviderExists(
        providerType,
        providerID,
        email
      );

      // Looks for any record matching id and email
      const existingProviderRecord = await checkIfRecordExists();

      if (!existingProvider) {
        if (existingProviderRecord) {
          return authErrorRedirect(req, res, {
            error: 'Provider account is already linked to another account.',
          });
        }

        if (email === '') {
          return authErrorRedirect(req, res, {
            error: 'Email cannot be retrieved.',
            email: '',
            providerType,
          });
        }

        // Check if either field is empty and redirect the user to form to complete missing fields
        if (givenName === '' || familyName === '') {
          return authErrorRedirect(req, res, {
            error: 'User account name fields are empty.',
            givenName,
            familyName,
            email,
            providerType,
            providerID,
            extraParam,
          });
        }

        const userProfileData = {
          givenName,
          familyName,
          email,
          providerType,
          providerID,
          extraParam,
        };

        const newAccount = await createUserAccount(userProfileData);

        req.user = setToken(newAccount);
        return redirectSetTokens(req, res);
      }

      Object.assign(req.user, setToken(existingProvider));
      return redirectSetTokens(req, res, existingProvider.role);
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

  try {
    const userProfileData = decodeToken(req.cookies.initialSetup, 'SETUP');

    userProfileData.givenName = req.body.userInputData.givenName;
    userProfileData.familyName = req.body.userInputData.familyName;

    const newAccount = await createUserAccount(userProfileData);

    const { accessToken, refreshToken } = setToken(newAccount);

    // isUserInput flags the redirect to navigate to complete-setup page
    const isUserInput = true;

    req.user = { accessToken, refreshToken, isUserInput };
    return redirectSetTokens(req, res, newAccount.role);
  } catch (error) {
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
      res.status(401).redirect(`${process.env.CLIENT_URL}/account-management`);
    }
  }
  next();
};

module.exports = {
  checkIfProviderExists,
  checkIfRecordExists,
  authErrorRedirect,
  setRoleForEmailDomain,
  setUserInformation,
  createUserAccount,
  authenticateOrCreateAccount,
  completeProfileSetup,
  synchronizeAccount,
};
