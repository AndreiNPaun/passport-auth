import React from 'react';
import { Button } from '@chakra-ui/react';

const CustomButton = ({ type, onClick, onBlur, children, ...styles }) => {
  return (
    <Button
      type={type || 'button'}
      onClick={onClick}
      onBlur={onBlur}
      color="white"
      bg="blue.500"
      _hover={{ bg: 'blue.700' }}
      _active={{ bg: 'blue.800', boxShadow: 'none' }}
      {...styles}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
