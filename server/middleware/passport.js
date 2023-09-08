const passport = require('passport');
const User = require('../models/users');

const {
  authentication,
  synchronizationRequest,
} = require('../controllers/users');

// Strategies
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

// Microsoft
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK,
      scope: ['user.read'],
      tenant: 'common',
      userAudience: 'All',
      authorizationURL:
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('Microsoft Profile', profile);

      // User details
      const givenName = profile.name.givenName || '';
      const familyName = profile.name.familyName || '';
      const email = profile.emails[0].value || '';

      // Stores the provider details (e.g. google)
      const providerType = profile.provider;
      const providerID = profile.id;

      // Checks if state is set used for syncing accounts
      const urlObj = new URL(req.originalUrl, 'https://www.justaparam.com'); // Dummy URL which needs to be included
      const state = urlObj.searchParams.get('state');

      const userData = {
        givenName,
        familyName,
        email,
        providerType,
        providerID,
      };

      if (state === 'sync') {
        const respone = await synchronizationRequest(userData);
        return done(null, respone);
      }

      // Controller registration function
      const response = await authentication(userData);
      done(null, response);
    }
  )
);

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req, res, accessToken, refreshToken, profile, done) => {
      console.log('Google Profile:', profile);

      // User details
      const givenName = profile.name.givenName;
      const familyName = profile.name.familyName;
      const email = profile.emails[0].value;

      // Stores the provider details (e.g. google)
      const providerType = profile.provider;
      const providerID = profile.id;

      // Checks if state is set used for syncing accounts
      const urlObj = new URL(req.originalUrl, 'https://www.justaparam.com'); // Dummy URL which needs to be included
      const state = urlObj.searchParams.get('state');

      const userData = {
        givenName,
        familyName,
        email,
        providerType,
        providerID,
      };

      if (state === 'sync') {
        const respone = await synchronizationRequest(res, userData);
        return done(null, respone);
      }

      // Controller registration function which returns the jwt tokens
      const response = await authentication(userData);

      done(null, response);
    }
  )
);

// GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('GitHub Profile:', profile);

      // User details
      // GitHub does not return givenName or familyName, set to null to not break the reusable controller
      let givenName = '';
      let familyName = '';
      let email = profile._json.email || '';

      // Stores the provider details (e.g. google)
      const providerType = profile.provider;
      const providerID = profile.id;
      const username = profile.username;

      // Checks if state is set used for syncing accounts
      const urlObj = new URL(req.originalUrl, 'https://www.justaparam.com'); // Dummy URL which needs to be included
      const state = urlObj.searchParams.get('state');

      // Check if there is an existing record using username
      const gitHubUser = await User.findOne({
        'provider.github.username': username,
      });

      if (gitHubUser) {
        givenName = gitHubUser.givenName;
        familyName = gitHubUser.familyName;

        // Check if email is not already set
        email = email ? email : gitHubUser.email;
      }

      const userData = {
        givenName,
        familyName,
        email,
        providerType,
        providerID,
        extraParam: ['username', username], // needed by GitHub Passport to validate user in case email is missing from API call
      };

      if (state === 'sync') {
        const respone = await synchronizationRequest(userData);
        return done(null, respone);
      }

      // Controller registration function
      const response = await authentication(userData);

      done(null, response);
    }
  )
);

// LinkedIn
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK,
      scope: ['r_emailaddress', 'r_liteprofile'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('LinkedIn Profile:', profile);

      // User details
      const givenName = profile.name.givenName || '';
      const familyName = profile.name.familyName || '';
      const email = profile.emails[0].value || '';

      // Stores the provider details (e.g. google)
      const providerType = profile.provider;
      const providerID = profile.id;

      // Checks if state is set used for syncing accounts
      const urlObj = new URL(req.originalUrl, 'https://www.justaparam.com'); // Dummy URL which needs to be included
      const state = urlObj.searchParams.get('state');

      const userData = {
        givenName,
        familyName,
        email,
        providerType,
        providerID,
      };

      if (state === 'sync') {
        const respone = await synchronizationRequest(userData);
        return done(null, respone);
      }

      // Controller registration function
      const response = await authentication(userData);

      done(null, response);
    }
  )
);

module.exports = passport;
