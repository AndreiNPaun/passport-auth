import React from 'react';
import { FormControl, Center, Text, Box } from '@chakra-ui/react';

import Card from './UI/Card';
import InputFields from './UI/InputFields';
import CustomButton from './UI/ButtonUI';

const EditProfileForm = ({
  userData = null,
  givenNameInputRef,
  familyNameInputRef,
  emailInputRef,
  submitHandler,
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
            defaultValue={userData?.givenName || ''}
            ref={givenNameInputRef}
            required
          />
          <InputFields
            htmlFor="familyName"
            labelText="Family Name"
            id="familyName"
            defaultValue={userData?.familyName || ''}
            ref={familyNameInputRef}
            required
          />
          <InputFields
            htmlFor="email"
            labelText="Email"
            id="email"
            defaultValue={userData?.email || ''}
            ref={emailInputRef}
            required
          />
          <Center>
            <CustomButton onClick={submitHandler} mt="1.5rem" w="8rem">
              Submit
            </CustomButton>
          </Center>
        </FormControl>
      </Card>
    </Center>
  );
};

export default EditProfileForm;
