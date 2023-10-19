import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Flex,
  Box,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useMediaQuery,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import Logout from '../components/Authentication/Logout';

const MainNavigation = () => {
  const login = useSelector((state) => state.login.loginCheck);
  const role = useSelector((state) => state.login.role);

  const [is1200] = useMediaQuery('(min-width: 1200px)');

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

      {is1200 ? (
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
      ) : (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList zIndex={1000}>
            {role && (role === 'admin' || role === 'moderator') && (
              <MenuItem as={RouterLink} to="admin-dashboard">
                Dashboard
              </MenuItem>
            )}
            <MenuItem as={RouterLink} to="account-management">
              My Account
            </MenuItem>
            <MenuItem onClick={() => <Logout />}>Logout</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

export default MainNavigation;
