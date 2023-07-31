const jwt = require('jsonwebtoken');

const User = require('../models/users');

// Passport user registration function
const authentication = async (
  givenName,
  familyName,
  email,
  providerType,
  providerID,
  extraParam
) => {
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
      if (!givenName || !familyName || !email) {
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

      // Checks for user's both names and if they match with another account but has a different email address store records together
      const userNames = await User.findOne({ givenName, familyName });

      if (userNames) {
        await User.updateOne(
          { givenName, familyName },
          {
            $set: {
              [`provider.${providerType}.id`]: providerID,
              [`provider.${providerType}.givenName`]: givenName,
              [`provider.${providerType}.familyName`]: familyName,
              [`provider.${providerType}.email`]: email,
            },
          }
        );

        // Set tokens
        const jwtToken = setToken(userNames);
        console.log('tokens', jwtToken);

        return jwtToken;
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
      console.log('tokens', jwtToken);

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
    console.log('token', jwtToken.token);
    console.log('refreshToken', jwtToken.refreshToken);

    return jwtToken;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// Creates the JWT Tokens
const setToken = (user) => {
  const token = jwt.sign({ id: user._id }, 'secretToken', {
    expiresIn: '3s',
  });

  const refreshToken = jwt.sign({ id: user._id }, 'secretRefreshToken', {
    expiresIn: '30d',
  });

  return { token, refreshToken };
};

// Controller which will amend user record based on user input
const userData = async (req, res, next) => {
  console.log('User Data:', req.body.userData);

  const {
    givenName,
    familyName,
    email,
    provider: providerType,
    providerID,
    extraParam,
  } = req.body.userData;

  // Splitting params into key value pairs
  const splitParams = extraParam.split(' ');
  const key = splitParams[0];
  const value = splitParams[1];

  // Check if there is an existing account with the same email
  const response = await User.findOne({ email });

  // If same email account exists update record
  if (response) {
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

    return res.status(200).redirect(process.env.CLIENT_URL);
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

  await newUserAccount.save();
  console.log('User created.');

  res.status(200).redirect(process.env.CLIENT_URL);
};

// Refresh Token
const refreshExpiredToken = (req, res, next) => {
  try {
    // Checks if the token has expired
    const token = req.cookies.token;
    jwt.verify(token, 'secretToken');

    console.log('Token has not expired');
  } catch (error) {
    // If token has expired it will try to refresh it
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired.');

      try {
        // Checks if the refresh token has expired
        const refreshToken = req.cookies.refreshToken;
        const decodeRefreshToken = jwt.verify(
          refreshToken,
          'secretRefreshToken'
        );

        // If refresh token is valid then another token will be generated
        const token = jwt.sign({ id: decodeRefreshToken._id }, 'secretToken', {
          expiresIn: '3s',
        });

        console.log('Newly generated token:', token);

        return res
          .cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
          })
          .json({ message: 'Token refreshed.' });
      } catch (error) {
        // If then refresh token has expired display authentication error
        if (error.name === 'TokenExpiredError') {
          console.log('Refresh token has expired. Authentication failed.');
        } else {
          console.log('Error:', error);
          res.status(400).json({ error: `An error has occured: ${error}` });
        }
      }
    } else {
      // In case there is another authentication error send it
      console.log('Error:', error);
      res.status(500).json({ message: 'Authentication failed.' });
    }
  }
};

module.exports = {
  authentication,
  userData,
  refreshExpiredToken,
};
