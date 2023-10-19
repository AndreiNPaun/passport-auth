import React, { useState } from 'react';

import { Box, Text, Grid, Center, useMediaQuery } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import CustomButton from '../../UI/CustomButton';

import Modal from '../../UI/Modal';
import ProviderList from './ProviderList';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../../utils/authorizationLinks';

import Card from '../../UI/Card';

const ProviderArea = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [providerName, setProviderName] = useState('');

  const [is1200] = useMediaQuery('(min-width: 1200px)');

  const showListHandler = () => {
    setIsListOpen(true);
  };

  const closeListHandler = () => {
    setIsListOpen(false);
  };

  const providerNameHandler = (providerName) => {
    setProviderName(providerName);
  };

  const renderGrid = ({ color, Icon, authorizationFunction, name }) => {
    if (is1200) {
      return (
        <Grid
          key={name}
          templateColumns="auto 1fr auto auto"
          gap="1rem"
          mb="1.5rem"
          alignItems="center"
          p="1rem"
          bg="white"
          boxShadow="sm"
          borderRadius="5px"
          border="1px solid"
          borderColor="gray.200"
        >
          <Box bg={color} p="0.5rem" borderRadius="5px">
            <Icon size="1.5em" color="white" />
          </Box>
          <Text fontSize="xl" fontWeight="600" color="gray.700">
            {name}
          </Text>
          <CustomButton onClick={() => authorizationFunction(true)}>
            Add
          </CustomButton>
          <CustomButton
            onClick={() => {
              showListHandler();
              providerNameHandler(name);
            }}
          >
            See Connections
          </CustomButton>
        </Grid>
      );
    } else {
      return (
        <Grid
          key={name}
          templateColumns="auto 1fr"
          templateRows="auto auto auto"
          gap="1rem"
          mb="1.5rem"
          alignItems="center"
          p="1rem"
          bg="white"
        >
          <Box bg={color} p="0.5rem" borderRadius="5px">
            <Icon size="1.5em" color="white" />
          </Box>
          <Text fontSize="xl" fontWeight="600" color="gray.700">
            {name}
          </Text>
          <CustomButton
            onClick={() => authorizationFunction(true)}
            gridColumn="span 2"
          >
            Add
          </CustomButton>
          <CustomButton
            onClick={() => {
              showListHandler();
              providerNameHandler(name);
            }}
            gridColumn="span 3"
          >
            See Connections
          </CustomButton>
        </Grid>
      );
    }
  };

  return (
    <>
      {isListOpen && (
        <Modal onClickCancel={closeListHandler}>
          <ProviderList providerName={providerName} />
        </Modal>
      )}
      <Center ml="-1rem">
        <Card m="1rem" maxW={is1200 ? '59%' : '70%'}>
          <Grid templateColumns="30% 70%" gap="1rem">
            {is1200 && (
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
            )}
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
              ].map((provider) => renderGrid(provider))}
            </Box>
          </Grid>
        </Card>
      </Center>
    </>
  );
};

export default ProviderArea;
