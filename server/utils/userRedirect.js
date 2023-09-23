const { sign } = require('jsonwebtoken');

const redirectSetTokens = (req, res) => {
  const accessToken = req.user.accessToken;
  const refreshToken = req.user.refreshToken;

  const isUserInput = req.user.isUserInput;

  if (accessToken && refreshToken) {
    console.log('Log In successful.');

    res
      .status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      });

    // If user creates account using input data, client will manage redirect link to AuthCheck
    if (isUserInput) {
      return res.send(true);
    }

    res.redirect(`${process.env.CLIENT_URL}/login-check?isLoggedIn=true`);
  } else {
    console.log('Server error.');
    res.status(400).redirect(process.env.CLIENT_URL);
  }
};

const redirectSync = (req, res) => {
  const synchronization = req.user.synchronized;

  if (synchronization === 'synchronized') {
    console.log('Accounts synchronized successfully.');

    // testing
    if (res.user?.refreshedAccessToken) {
      return res.cookie('plm', 'pula').redirect(`${process.env.CLIENT_URL}/`);
    }

    return res.redirect(`${process.env.CLIENT_URL}/account-management`);
  }
};

const redirectWithError = (req, res) => {
  const errorMessage = req.user.error;

  if (errorMessage) {
    console.log('Error redirect');

    const {
      givenName,
      familyName,
      email,
      providerType,
      providerID,
      extraParam,
      sync,
    } = req.user;

    if (email === '' && !sync) {
      return res.redirect(
        `${process.env.CLIENT_URL}/no-email?provider=${providerType}`
      );
    }

    const givenNameCheck = givenName ? givenName : '';
    const familyNameCheck = familyName ? familyName : '';

    const extraParamFormat = extraParam ? extraParam : '';

    const initialSetup = sign(
      {
        givenName: givenNameCheck,
        familyName: familyNameCheck,
        email,
        providerType,
        providerID,
        extraParam: extraParamFormat,
      },
      process.env.SETUP_TOKEN_SECRET,
      {
        expiresIn: process.env.SETUP_TOKEN_EXPIRY,
      }
    );

    return res
      .cookie('initialSetup', initialSetup, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      })
      .redirect(
        `${process.env.CLIENT_URL}/create-account?provider=${providerType}`
      );
  }
};

module.exports = { redirectSetTokens, redirectSync, redirectWithError };
