import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Text, Center, Box, FormControl, Link } from '@chakra-ui/react';
import Card from '../../UI/Card';
import InputFields from '../../UI/InputFields';
import CustomButton from '../../UI/CustomButton';

const SubmitAccountDetailsForm = ({
  providerText,
  givenName,
  familyName,
  email,
  submitUserData,
  givenNameInputRef,
  familyNameInputRef,
  emailInputRef,
}) => {
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
          Setup Account
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

export default SubmitAccountDetailsForm;
