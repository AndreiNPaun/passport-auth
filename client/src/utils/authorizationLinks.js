// Microsoft
export const MicrosoftAuthorisation = (state) => {
  // URL Build Up Function
  const CLIENT_ID = process.env.REACT_APP_MICROSOFT_ID;
  const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/microsoft/callback`;
  const STATE = state ? '&state=sync' : '';

  const AUTHORIZATION_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_mode=query&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read${STATE}`;

  window.location.href = AUTHORIZATION_URL;
};

// Google
export const GoogleAuthorisation = (state) => {
  // URL Build Up Function
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_ID;
  const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/google/callback`;
  const STATE = state ? '&state=sync' : '';

  const AUTHORIZATION_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.profile+https%3A//www.googleapis.com/auth/userinfo.email&include_granted_scopes=true&response_type=code${STATE}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&client_id=${CLIENT_ID}`;

  window.location.href = AUTHORIZATION_URL;
};

// GitHub
export const GithubAuthorisation = (state) => {
  // URL Build Up Function
  const CLIENT_ID = process.env.REACT_APP_GITHUB_ID;
  const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/github/callback`;
  const STATE = state ? '&state=sync' : '';

  const AUTHORIZATION_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}${STATE}`;

  window.location.href = AUTHORIZATION_URL;
};

// LinkedIn
export const LinkedInAuthorisation = (state) => {
  // URL Build Up Function
  const CLIENT_ID = process.env.REACT_APP_LINKEDIN_ID;
  const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/linkedin/callback`;
  const STATE = state ? '&state=sync' : '';

  const AUTHORIZATION_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}${STATE}&scope=r_liteprofile%20r_emailaddress`;

  window.location.href = AUTHORIZATION_URL;
};
