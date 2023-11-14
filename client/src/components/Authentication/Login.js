import React from 'react';
import { Text, Center, Grid, GridItem, Box } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft } from 'react-icons/fa';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../utils/authorizationLinks';
import CustomButton from '../UI/CustomButton';
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
          {[
            {
              authorizationFunction: MicrosoftAuthorisation,
              Icon: FaMicrosoft,
              color: '#0078D4',
              name: 'Microsoft',
            },
            {
              authorizationFunction: GoogleAuthorisation,
              Icon: FaGoogle,
              color: '#DB4437',
              name: 'Google',
            },
            {
              authorizationFunction: GithubAuthorisation,
              Icon: FaGithub,
              color: '#181717',
              name: 'GitHub',
            },
            {
              authorizationFunction: LinkedInAuthorisation,
              Icon: FaLinkedin,
              color: '#0A66C2',
              name: 'LinkedIn',
            },
          ].map(({ authorizationFunction, Icon, color, name }) => (
            <GridItem key={name} m="0">
              <CustomButton
                onClick={() => authorizationFunction()}
                leftIcon={<Icon />}
                bg={color}
                w="85%"
                m="0.5rem 2rem"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
                }}
                _active={{ transform: 'none' }}
                transition="all 0.2s"
              >
                {name}
              </CustomButton>
            </GridItem>
          ))}
        </Grid>
      </Card>
    </Center>
  );
};

export default Login;
