import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Flex, Box, Link, Text } from '@chakra-ui/react';

import Logout from '../components/Authentication/Logout';

const MainNavigation = () => {
  const login = useSelector((state) => state.login.loginCheck);
  const role = useSelector((state) => state.login.role);

  if (!login) {
    return null;
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem 2rem"
      bg="white"
      color="gray.700"
    >
      <Flex align="center" mr="5rem">
        <Text as={RouterLink} to="" fontSize="xl" fontWeight="bold">
          Auth
        </Text>
      </Flex>
      <Box>
        {role && (role === 'admin' || role === 'moderator') && (
          <Link m="0 1rem" as={RouterLink} to="admin-dashboard">
            Dashboard
          </Link>
        )}
        <Link m="0 1rem" as={RouterLink} to="account-management">
          My Account
        </Link>
        <Logout />
      </Box>
    </Flex>
  );
};

export default MainNavigation;
