const { sign } = require('jsonwebtoken');

const redirectSetTokens = (req, res) => {
  const accessToken = req.user.accessToken;
  const refreshToken = req.user.refreshToken;

  const isUserInput = req.user.isUserInput;
  console.log('checking uinput', isUserInput);

  if (accessToken && refreshToken) {
    console.log('Log In successful.');

    if (req.cookies.initialSetup) {
      res.clearCookie('initialSetup');
    }

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

    if (isUserInput) {
      return res.end();
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

    if (
      errorMessage.error ===
      'Provider account is already linked to another account.'
    ) {
      console.log('testing');
      return res.redirect(`${process.env.CLIENT_URL}/`);
    }

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
        `${process.env.CLIENT_URL}/complete-setup?provider=${providerType}`
      );
  }
};

module.exports = { redirectSetTokens, redirectSync, redirectWithError };
