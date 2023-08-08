import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Flex, Text } from '@chakra-ui/react';

import Logout from '../components/Authentication/Logout';

const MainNavigation = () => {
  const login = useSelector((state) => state.login.loginCheck);

  if (!login) {
    return null;
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="blue.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Text fontSize="xl" fontWeight="bold">
          Auth
        </Text>
      </Flex>
      <Logout />
    </Flex>
  );
};

export default MainNavigation;
