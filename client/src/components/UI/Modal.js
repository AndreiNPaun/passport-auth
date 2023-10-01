import React from 'react';
import { Box } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

import { setFormClose } from '../../store/action/form';

const Modal = ({ children }) => {
  const dispatch = useDispatch();

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const onClickCancel = () => {
    dispatch(setFormClose());
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
