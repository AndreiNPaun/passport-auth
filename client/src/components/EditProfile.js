import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FormControl, Center, Text } from '@chakra-ui/react';

import CheckTokenValidity from '../utils/CheckTokenValidity';
import httpRequest from '../utils/httpRequest';

import Card from './UI/Card';
import InputFields from './UI/InputFields';
import CustomButton from './UI/ButtonUI';

const EditProfile = () => {
  // Passed down as arguments for CheckTokenValidity
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const givenNameInputRef = useRef();
  const familyNameInputRef = useRef();
  const emailInputRef = useRef();

  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      const getData = async () => {
        const response = await httpRequest(
          'get',
          `${process.env.REACT_APP_SERVER_URL}/edit-profile`
        );
        return response;
      };

      const userData = await CheckTokenValidity(getData, navigation, dispatch);
      console.log('userData', userData);
      setUserData(userData);
    })();
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();

    const userInputData = {
      givenName: givenNameInputRef.current.value,
      familyName: familyNameInputRef.current.value,
      email: emailInputRef.current.value,
    };

    const submitData = async () => {
      const response = await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/edit-profile`,
        { userInputData }
      );
      return response;
    };

    const userData = CheckTokenValidity(submitData, navigation, dispatch);
    console.log('userData', userData);
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

export default EditProfile;
