import React from 'react';

import styles from './Login.module.css';

const Login = () => {
  // GitHub Authorisation URL Build-Up
  const githubAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_GITHUB_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/github/callback`;

    const AUTHORIZATION_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;

    return AUTHORIZATION_URL;
  };

  // LinkedIn Authorisation URL Build-Up
  const linkedinAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_LINKEDIN_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/linkedin/callback`;

    const AUTHORIZATION_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=abracadabraSecretStufff69&scope=r_liteprofile%20r_emailaddress`;

    return AUTHORIZATION_URL;
  };

  // Google Authorisation URL Build-Up
  const googleAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_GOOGLE_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/google/callback`;

    const AUTHORIZATION_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&include_granted_scopes=true&response_type=token&state=gigasecured28&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&client_id=${CLIENT_ID}`;

    return AUTHORIZATION_URL;
  };

  // Microsoft Authorisation URL Build-Up
  const microsoftAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_MICROSOFT_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/microsoft/callback`;

    const AUTHORIZATION_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_mode=query&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=avadacadabra12345`;

    return AUTHORIZATION_URL;
  };

  return (
    <div className={styles['login-container']}>
      <p>Login</p>
      <button className={styles['login-button']}>
        <a href={githubAuthorisationURL()}>GitHub</a>
      </button>
      <button className={styles['login-button']}>
        <a href={linkedinAuthorisationURL()}>LinkedIn</a>
      </button>
      <button className={styles['login-button']}>
        <a href={googleAuthorisationURL()}>Google</a>
      </button>
      <button className={styles['login-button']}>
        <a href={microsoftAuthorisationURL()}>Microsoft</a>
      </button>
    </div>
  );
};

export default Login;
