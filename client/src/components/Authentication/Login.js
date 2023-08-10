import React from 'react';
import { Text, Center, Grid, GridItem, Box } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft } from 'react-icons/fa';

import Card from '../UI/Card';
import CustomButton from '../UI/ButtonUI';

const Login = () => {
  // Authorisation URL Build-Up

  // GitHub
  const githubAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_GITHUB_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/github/callback`;

    const AUTHORIZATION_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;

    window.location.href = AUTHORIZATION_URL;
  };

  // LinkedIn
  const linkedinAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_LINKEDIN_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/linkedin/callback`;

    const AUTHORIZATION_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=abracadabraSecretStufff69&scope=r_liteprofile%20r_emailaddress`;

    window.location.href = AUTHORIZATION_URL;
  };

  // Google
  const googleAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_GOOGLE_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/google/callback`;

    const AUTHORIZATION_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&include_granted_scopes=true&response_type=token&state=gigasecured28&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&client_id=${CLIENT_ID}`;

    window.location.href = AUTHORIZATION_URL;
  };

  // Microsoft
  const microsoftAuthorisationURL = () => {
    const CLIENT_ID = process.env.REACT_APP_MICROSOFT_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_SERVER_URL}/auth/microsoft/callback`;

    const AUTHORIZATION_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_mode=query&scope=https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=avadacadabra12345`;

    window.location.href = AUTHORIZATION_URL;
  };

  const buttonStyle = {
    w: '85%',
    m: '0.5rem 2rem',
    _hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
    },
    transition: 'all 0.2s',
  };

  return (
    <Center h="95vh">
      <Card w="30rem" p="2rem">
        <Box mb="1rem">
          <Text
            p="1rem"
            m="0 auto"
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            color="blue.600"
          >
            Login to {process.env.REACT_APP_NAME}
          </Text>
          <Text textAlign="center" fontSize="lg" color="gray.600">
            Connect with
          </Text>
        </Box>

        <Grid
          templateColumns="repeat(1, 1fr)"
          gap={4}
          alignItems="center"
          justifyContent="center"
        >
          <GridItem m="0">
            <CustomButton
              onClick={githubAuthorisationURL}
              leftIcon={<FaGithub />}
              bg="#181717"
              {...buttonStyle}
            >
              GitHub
            </CustomButton>
          </GridItem>

          <GridItem m="0">
            <CustomButton
              onClick={linkedinAuthorisationURL}
              leftIcon={<FaLinkedin />}
              bg="#0A66C2"
              {...buttonStyle}
            >
              LinkedIn
            </CustomButton>
          </GridItem>

          <GridItem m="0">
            <CustomButton
              onClick={googleAuthorisationURL}
              leftIcon={<FaGoogle />}
              bg="#DB4437"
              {...buttonStyle}
            >
              Google
            </CustomButton>
          </GridItem>

          <GridItem m="0">
            <CustomButton
              onClick={microsoftAuthorisationURL}
              leftIcon={<FaMicrosoft />}
              bg="#0078D4"
              {...buttonStyle}
            >
              Microsoft
            </CustomButton>
          </GridItem>
        </Grid>
      </Card>
    </Center>
  );
};

export default Login;
