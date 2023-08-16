// Reusable redirect function which checks for the JWT Token
const userRedirect = (req, res, sync) => {
  const accessToken = req.user.accessToken;
  const refreshToken = req.user.refreshToken;

  console.log('accessToken route', accessToken);

  console.log('CHECK SYCN PARAM', sync);
  // Checks if controller sent an error message
  const errorMessage = req.user.error;

  if (errorMessage) {
    console.log('Redirecting user to setup form.');
    // Pull out user fields

    const {
      givenName,
      familyName,
      email,
      providerType,
      providerID,
      extraParam,
    } = req.user;

    // Generate URL, if value is null or false unset url
    const givenNameUrl = givenName ? `&givenName=${givenName}` : '';
    const familyNameUrl = familyName ? `&familyName=${familyName}` : '';
    const emailUrl = email ? `&email=${email}` : '';

    // Extra param will have the syntax key+value and will be sent back to server as an extra db field if set
    const extraParamUrl = extraParam
      ? `&extraParam=${extraParam[0]}+${extraParam[1]}`
      : '';

    let syncParam;
    if (sync) {
      syncParam = '&sync=true';
    }

    return res.redirect(
      `${
        process.env.CLIENT_URL
      }/create-account?provider=${providerType}&providerID=${providerID}${givenNameUrl}${familyNameUrl}${emailUrl}${extraParamUrl}${
        syncParam || ''
      }`
    );
  }

  if (accessToken && refreshToken) {
    console.log('Log In successful.');

    // Sets tokens as http cookie
    res
      .status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .redirect(`${process.env.CLIENT_URL}/login-check?isLoggedIn=true`);
  } else {
    console.log('Log In failed.');
    res.status(401).redirect(process.env.CLIENT_URL);
  }
};

const userRedirectSync = (req, res) => {
  // Checks if controller sent an error message
  const errorMessage = req.user.error;

  if (errorMessage) {
    console.log('Redirecting user to setup form.');
    // Pull out user fields

    const {
      givenName,
      familyName,
      email,
      providerType,
      providerID,
      extraParam,
    } = req.user;

    // Generate URL, if value is null or false unset url
    const givenNameUrl = givenName ? `&givenName=${givenName}` : '';
    const familyNameUrl = familyName ? `&familyName=${familyName}` : '';
    const emailUrl = email ? `&email=${email}` : '';

    // Extra param will have the syntax key+value and will be sent back to server as an extra db field if set
    const extraParamUrl = extraParam
      ? `&extraParam=${extraParam[0]}+${extraParam[1]}`
      : '';

    return res.redirect(
      `${process.env.CLIENT_URL}/create-accounts?provider=${providerType}&providerID=${providerID}${givenNameUrl}${familyNameUrl}${emailUrl}${extraParamUrl}&sync=true`
    );
  } else {
    console.log('Synchronization failed.');
    res.status(401).redirect(process.env.CLIENT_URL);
  }
};

module.exports = { userRedirect, userRedirectSync };
