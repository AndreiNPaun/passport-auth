import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Flex, Box, Link, Text, useMediaQuery } from '@chakra-ui/react';

import Logout from '../components/Authentication/Logout';
import HamburgerMenu from './UI/HamburgerMenu';

const MainNavigation = () => {
  const login = useSelector((state) => state.login.loginCheck);
  const role = useSelector((state) => state.login.role);

  const [is700] = useMediaQuery('(min-width: 700px)');

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

      {is700 ? (
        <Box>
          {role && (role === 'owner' || role === 'admin') && (
            <Link m="0 1rem" as={RouterLink} to="admin-dashboard">
              Admin Dashboard
            </Link>
          )}
          <Link m="0 1rem" as={RouterLink} to="">
            My Account
          </Link>
          <Link
            m="0 1rem"
            as={RouterLink}
            to="github-proxy-server?url=github.com"
          >
            GitHub
          </Link>
          <Logout />
        </Box>
      ) : (
        <HamburgerMenu role={role} />
      )}
    </Flex>
  );
};

export default MainNavigation;
