import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Center, Box, Text, Grid, GridItem } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft } from 'react-icons/fa';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../utils/authorizationLinks';

import Card from '../UI/Card';

const ProviderArea = () => {
  return (
    <Card mb="1rem">
      <Grid templateColumns="30% 70%" gap="1rem">
        <Box p="1rem" borderRight="1px solid" borderColor="gray.300">
          <Text fontSize="2xl" mt="2rem">
            Connections
          </Text>
          <Text mt="1rem">
            List of existing connections and platforms yet to be connected
            with&nbsp;
            <Box as="span" fontWeight="600" color="blue.500">
              {process.env.REACT_APP_NAME}
            </Box>
            .
          </Text>
        </Box>
        <Box p="2rem">
          {[
            {
              color: '#0078D4',
              Icon: FaMicrosoft,
              authorizationFunction: MicrosoftAuthorisation,
              name: 'Microsoft',
            },
            {
              color: '#DB4437',
              Icon: FaGoogle,
              authorizationFunction: GoogleAuthorisation,
              name: 'Google',
            },
            {
              color: '#181717',
              Icon: FaGithub,
              authorizationFunction: GithubAuthorisation,
              name: 'GitHub',
            },
            {
              color: '#0A66C2',
              Icon: FaLinkedin,
              authorizationFunction: LinkedInAuthorisation,
              name: 'LinkedIn',
            },
          ].map(({ color, Icon, authorizationFunction, name }) => (
            <Grid
              key={name}
              templateColumns="10% 60% 15% 15%"
              mb="0.5rem"
              minH="3.5rem"
              w="95%"
              maxWidth="45vw"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="5px"
            >
              <GridItem
                bg={color}
                borderTopLeftRadius="5px"
                borderBottomLeftRadius="5px"
              >
                <Center height="100%">
                  <Icon size="2em" color="white" />
                </Center>
              </GridItem>
              <GridItem
                m="0.8rem"
                fontSize="xl"
                fontWeight="600"
                color="gray.700"
              >
                {name}
              </GridItem>
              <GridItem
                as={RouterLink}
                mt="1rem"
                w="auto"
                _hover={{
                  textDecoration: 'none',
                  color: 'blue.600',
                }}
                onClick={() => authorizationFunction(true)}
              >
                Add
              </GridItem>
              <GridItem
                as={RouterLink}
                to="/provider-list"
                mt="1rem"
                w="auto"
                _hover={{
                  textDecoration: 'none',
                  color: 'blue.600',
                }}
                state={{ providerName: name }}
              >
                See Connections
              </GridItem>
            </Grid>
          ))}
        </Box>
      </Grid>
    </Card>
  );
};

export default ProviderArea;
