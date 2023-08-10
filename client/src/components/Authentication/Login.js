import React from 'react';
import { Text, Center, Grid, GridItem, Box } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft } from 'react-icons/fa';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../utils/authorizationLinks';

import Card from '../UI/Card';

const Login = () => {
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
            <MicrosoftAuthorisation />
          </GridItem>

          <GridItem m="0">
            <GoogleAuthorisation />
          </GridItem>

          <GridItem m="0">
            <GithubAuthorisation />
          </GridItem>

          <GridItem m="0">
            <LinkedInAuthorisation />
          </GridItem>
        </Grid>
      </Card>
    </Center>
  );
};

export default Login;
