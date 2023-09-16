// Reusable redirect function which checks for the JWT Token
const userRedirect = (req, res) => {
  console.log('reqqqq', req.user);
  const accessToken = req.user.accessToken;
  const refreshToken = req.user.refreshToken;

  // Checks if controller sent an error message
  const errorMessage = req.user.error;

  const isUserInput = req.user.isUserInput;

  if (errorMessage) {
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

    // Generate URL, if value is null or false unset url
    const givenNameUrl = givenName ? `&givenName=${givenName}` : '';
    const familyNameUrl = familyName ? `&familyName=${familyName}` : '';
    const emailUrl = email ? `&email=${email}` : '';

    // Extra param will have the syntax key+value and will be sent back to server as an extra db field if set
    const extraParamUrl = extraParam
      ? `&extraParam=${extraParam[0]}+${extraParam[1]}`
      : '';

    const syncUrl = sync ? `&sync=${sync}` : '';

    return res.redirect(
      `${process.env.CLIENT_URL}/create-account?provider=${providerType}&providerID=${providerID}${givenNameUrl}${familyNameUrl}${emailUrl}${extraParamUrl}${syncUrl}`
    );
  }

  if (req.user.synchronized === 'synchronized') {
    console.log('Accounts synchronized successfully.');

    if (res.user?.refreshedAccessToken) {
      return res.cookie('plm', 'pula').redirect(`${process.env.CLIENT_URL}/`);
    }

    return res.redirect(`${process.env.CLIENT_URL}/account-management`);
  }

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

module.exports = userRedirect;
