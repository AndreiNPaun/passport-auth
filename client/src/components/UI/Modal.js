import React from 'react';
import { Box } from '@chakra-ui/react';

const Modal = ({ children, onClickCancel }) => {
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  // Background styling
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    w: '100%',
    h: '100vh',
    zIndex: '10',
    bg: 'rgba(0, 0, 0, 0.75)',
  };

  return (
    <Box {...backgroundStyle} onClick={onClickCancel}>
      <Box w="40%" ml="30%" onClick={stopPropagation}>
        {children}
      </Box>
    </Box>
  );
};

export default Modal;
