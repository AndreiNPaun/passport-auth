import React from 'react';
import { Center, Box, Text } from '@chakra-ui/react';

import CustomButton from './CustomButton';
import Card from './Card';
import InputFields from './InputFields';

const Modal = ({
  modalTitle,
  modalText,
  onClickCancel,
  onClickSubmit,
  value,
  inputRef,
  cardStyle,
  errorText,
}) => {
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
        <Card mt="20vh" cardStyle={cardStyle}>
          <Text
            p="1rem"
            m="0 auto"
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            color="blue.600"
          >
            {modalTitle}
          </Text>
          <Center>
            <Text mb=".5rem" color="#181717">
              {modalText}
            </Text>
          </Center>
          {/* <Text pl="1.5rem" pb="0.3rem" color="red">
            {errorText}
          </Text> */}
          <Box ml="2.5rem">
            <InputFields
              htmlFor="givenName"
              labelText="First Name"
              id="givenName"
              defaultValue={value?.givenName || ''}
              ref={inputRef.givenNameInputRef}
              inputStyle={{ w: '90%' }}
              required
            />
          </Box>
          <Box ml="2.5rem">
            <InputFields
              htmlFor="givenName"
              labelText="First Name"
              id="givenName"
              defaultValue={value?.familyName || ''}
              ref={inputRef.familyNameInputRef}
              inputStyle={{ w: '90%' }}
              required
            />
          </Box>
          <Box ml="2.5rem">
            <InputFields
              htmlFor="givenName"
              labelText="First Name"
              id="givenName"
              defaultValue={value?.email || ''}
              ref={inputRef.emailInputRef}
              inputStyle={{ w: '90%' }}
              required
            />
          </Box>
          <Center mt="1rem">
            <CustomButton m="1rem" type="submit" onClick={onClickSubmit}>
              Submit
            </CustomButton>
            <CustomButton m="1rem" onClick={onClickCancel}>
              Close
            </CustomButton>
          </Center>
        </Card>
      </Box>
    </Box>
  );
};

export default Modal;
