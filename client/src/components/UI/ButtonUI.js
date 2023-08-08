import React from 'react';
import { Button } from '@chakra-ui/react';

const CustomButton = ({ type, onClick, onBlur, children, ...props }) => {
  return (
    <Button
      type={type || 'button'}
      onClick={onClick}
      onBlur={onBlur}
      color="white"
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
