import React from 'react';
import {
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  VStack,
  useDisclosure,
  Link,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

import Logout from '../Authentication/Logout';

const HamburgerMenu = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {!isOpen && (
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
          size="lg"
          color="current"
        />
      )}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent backgroundColor="#333" color="white">
          <DrawerCloseButton top="1.4rem" right="2.2rem" size="lg" />
          <DrawerBody p={4}>
            <VStack spacing="24px" mt="3.5rem">
              {props.role &&
                (props.role === 'owner' || props.role === 'admin') && (
                  <Link
                    m="0 1rem"
                    as={RouterLink}
                    to="admin-dashboard"
                    onClick={onClose}
                  >
                    Admin Dashboard
                  </Link>
                )}
              <Link m="0 1rem" as={RouterLink} to="" onClick={onClose}>
                My Account
              </Link>
              <Logout color="white" />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
