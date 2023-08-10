import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { unsetToken } from '../../store/action/login';

const Logout = () => {
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(unsetToken());
  };

  return (
    <Link
      as={RouterLink}
      to="/"
      textDecoration="none"
      color="gray.700"
      padding="8px 12px"
      borderRadius="4px"
      transition="color 0.3s ease"
      _hover={{
        color: 'blue.500',
        textDecoration: 'underline',
      }}
      onClick={logoutUser}
    >
      Logout
    </Link>
  );
};

export default Logout;
