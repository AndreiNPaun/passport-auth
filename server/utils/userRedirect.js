const { sign } = require('jsonwebtoken');

const redirectSetTokens = (req, res, role) => {
  const accessToken = req.user.accessToken;
  const refreshToken = req.user.refreshToken;

  // This parameter will ensure there will be no redirection
  const isUserInput = req.user.isUserInput;

  if (accessToken && refreshToken) {
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
      return res.send(`role=${role}`);
    }

    res.redirect(
      `${process.env.CLIENT_URL}/login-check?isLoggedIn=true&role=${role}`
    );
  } else {
    res.status(400).redirect(process.env.CLIENT_URL);
  }
};

const redirectSync = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}`);
};

const redirectWithError = (req, res) => {
  const userError = req.user.error;

  if (userError) {
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
      userError.error ===
      'Provider account is already linked to another account.'
    ) {
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
  } else {
    throw new Error('No user error specified.');
  }
};

module.exports = { redirectSetTokens, redirectSync, redirectWithError };
