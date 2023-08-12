import React from 'react';
import { FormControl, Center, Text, Box } from '@chakra-ui/react';

import CheckTokenValidity from '../utils/CheckTokenValidity';
import httpRequest from '../utils/httpRequest';

import Card from './UI/Card';
import InputFields from './UI/InputFields';
import CustomButton from './UI/ButtonUI';

const EditProfile = () => {
  const request = async () => {
    const response = await httpRequest(
      'get',
      `${process.env.REACT_APP_SERVER_URL}/edit-profile`
    );

    return response;
  };

  const userData = CheckTokenValidity(request);
  console.log('userData', userData);

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
          Edit Account
        </Text>
        <Center>
          <Text mb=".5rem" color="#181717">
            Edit your account
          </Text>
        </Center>

        <FormControl>
          <InputFields
            htmlFor="givenName"
            labelText="First Name"
            id="givenName"
            required
          />
          <InputFields
            htmlFor="familyName"
            labelText="Family Name"
            id="familyName"
            required
          />
          <InputFields htmlFor="email" labelText="Email" id="email" required />
          <Center>
            <CustomButton mt="1.5rem" w="8rem">
              Submit
            </CustomButton>
          </Center>
        </FormControl>
      </Card>
    </Center>
  );
};

export default EditProfile;
