import React, { useState } from 'react';
import { Box, Text, Grid, Center, useMediaQuery } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft } from 'react-icons/fa';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../../utils/authorizationLinks';
import Modal from '../../UI/Modal';
import ProviderList from './ProviderList';
import Card from '../../UI/Card';
import ProviderGridItem from './ProviderGridItem';

const ProviderArea = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [providerName, setProviderName] = useState('');

  const [is1130] = useMediaQuery('(min-width: 1130px)');

  const showListHandler = () => {
    setIsListOpen(true);
  };

  const closeListHandler = () => {
    setIsListOpen(false);
  };

  const providerNameHandler = (providerName) => {
    setProviderName(providerName);
  };

  return (
    <>
      {isListOpen && (
        <Modal onClickCancel={closeListHandler}>
          <ProviderList providerName={providerName} />
        </Modal>
      )}
      <Center>
        <Card
          m={is1130 ? '2rem auto 0 auto' : '1rem auto'}
          maxW={is1130 ? '60%' : '90%'}
          w="100%"
          overflow="hidden"
        >
          <Grid templateColumns="30% 70%" gap="1rem">
            {is1130 && (
              <Box p="1rem" borderRight="1px solid" borderColor="gray.300">
                <Text fontSize="2xl" mt="2rem">
                  Connections
                </Text>
                <Text mt="1rem">
                  Below is a comprehensive overview of your current integrations
                  and potential platforms that can be linked with&nbsp;
                  <Box as="span" fontWeight="600" color="blue.500">
                    {process.env.REACT_APP_NAME}
                  </Box>
                  . Explore and manage your connectivity options.
                </Text>
              </Box>
            )}
            <Box p="2rem" mt="1rem">
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
              ].map((provider) => (
                <ProviderGridItem
                  key={provider.name}
                  color={provider.color}
                  Icon={provider.Icon}
                  authorizationFunction={provider.authorizationFunction}
                  name={provider.name}
                  is1130={is1130}
                  onShowList={(name) => {
                    showListHandler();
                    providerNameHandler(name);
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Card>
      </Center>
    </>
  );
};

export default ProviderArea;
