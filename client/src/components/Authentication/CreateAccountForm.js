import React, { useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Text, Center, Box, FormControl, Link } from '@chakra-ui/react';

import httpRequest from '../../utils/httpRequest';
import Card from '../UI/Card';
import InputFields from '../UI/InputFields';
import CustomButton from '../UI/ButtonUI';

const CreateAccountForm = () => {
  const givenNameInputRef = useRef();
  const familyNameInputRef = useRef();
  const emailInputRef = useRef();

  const navigate = useNavigate();

  // URL data
  const urlParams = new URLSearchParams(window.location.search);

  // If URL values are null set them to empty string
  const givenName = urlParams.get('givenName') || '';
  const familyName = urlParams.get('familyName') || '';
  const email = urlParams.get('email') || '';

  // Can't be empty
  const provider = urlParams.get('provider');
  const providerID = urlParams.get('providerID');

  // Capitalize first letter for form text
  const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

  // Extra param which will be slit into key value pair
  const extraParam = urlParams.get('extraParam') || '';

  // Send updated user data to server
  const submitUserData = async (event) => {
    event.preventDefault();

    // Data which is already set in the URL will replace the one which is supposed to be from the user input
    // Input fields will be hidden if the user data can be retrieved from the URL
    const userData = {
      givenName: givenNameInputRef.current?.value || givenName,
      familyName: familyNameInputRef.current?.value || familyName,
      email: emailInputRef.current?.value || email,
      provider: provider,
      providerID: providerID,
      extraParam: extraParam,
    };

    try {
      console.log(userData);
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/user-data`,
        { userData }
      );

      console.log('works');

      console.log(response);

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <Center h="95vh">
      <Card p="2rem">
        <Text
          p="1rem"
          m="0 auto"
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          color="blue.600"
        >
          User Registration
        </Text>

        <Center>
          <Text mb=".5rem" color="#181717">
            Enter your details associated with your&nbsp;
            <Box as="span" fontWeight="bold" color="blue.600">
              {providerText}
            </Box>
            &nbsp;account
          </Text>
        </Center>

        <Text
          m=".5rem auto"
          textAlign="center"
          fontWeight="bold"
          color="blue.600"
        >
          Or
        </Text>

        <Center>
          <Text mb="2rem" color="#181717">
            <Link
              as={RouterLink}
              to="/"
              fontWeight="bold"
              color="blue.600"
              _hover={{
                textDecoration: 'underline',
                color: 'blue.700',
              }}
              _active={{
                color: 'blue.800',
              }}
            >
              Click here
            </Link>
            &nbsp;to go back and select another platform
          </Text>
        </Center>

        <FormControl>
          {!givenName && (
            <InputFields
              htmlFor="givenName"
              labelText="First Name"
              id="givenName"
              ref={givenNameInputRef}
              required
            />
          )}

          {!familyName && (
            <InputFields
              htmlFor="familyName"
              labelText="Last Name"
              id="familyName"
              ref={familyNameInputRef}
              required
            />
          )}

          {!email && (
            <InputFields
              htmlFor="email"
              labelText="Email"
              id="email"
              ref={emailInputRef}
              required
            />
          )}

          <Center>
            <CustomButton mt="1.5rem" w="8rem" onClick={submitUserData}>
              Submit
            </CustomButton>
          </Center>
        </FormControl>
      </Card>
    </Center>
  );
};

export default CreateAccountForm;
