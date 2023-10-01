import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSubmit } from 'react-router-dom';

import { setFormClose } from '../../store/action/form';

import Modal from '../UI/Modal';

import { Center, Box, Text } from '@chakra-ui/react';

import CustomButton from '../UI/CustomButton';
import Card from '../UI/Card';
import InputFields from '../UI/InputFields';

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const submit = useSubmit();

  const [userDataInput, setUserDataInput] = useState({
    givenName: props.userData.givenName || '',
    familyName: props.userData.familyName || '',
    email: props.userData.email || '',
  });

  const userDataChangeHandler = (event) => {
    const { name, value } = event.target;
    setUserDataInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = (event) => {
    event.preventDefault();

    setUserDataInput(userDataInput);

    props.updateDisplayedUserData(userDataInput);

    const givenName = userDataInput.givenName;
    const familyName = userDataInput.familyName;
    const email = userDataInput.email;

    submit({ givenName, familyName, email }, { method: 'post' });
    dispatch(setFormClose());
  };

  const closeFormHandler = () => {
    dispatch(setFormClose());
  };

  const fields = [
    {
      htmlFor: 'givenName',
      labelText: 'First Name',
      id: 'givenName',
      name: 'givenName',
      value: 'givenName',
    },
    {
      htmlFor: 'familyName',
      labelText: 'Family Name',
      id: 'familyName',
      name: 'familyName',
      value: 'familyName',
    },
    {
      htmlFor: 'email',
      labelText: 'Email',
      id: 'email',
      name: 'email',
      value: 'email',
    },
  ];

  return (
    <Modal>
      <Card mt="20vh">
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
        {/* <Text pl="1.5rem" pb="0.3rem" color="red">
            {errorText}
          </Text> */}
        {fields.map((field) => (
          <Box key={field.id} ml="2.5rem">
            <InputFields
              htmlFor={field.htmlFor}
              labelText={field.labelText}
              id={field.id}
              name={field.name}
              defaultValue={props.userData[field.value] || ''}
              onChange={userDataChangeHandler}
              inputStyle={{ w: '90%' }}
              required
            />
          </Box>
        ))}
        <Center mt="1rem">
          <CustomButton m="1rem" type="submit" onClick={submitFormHandler}>
            Submit
          </CustomButton>
          <CustomButton m="1rem" onClick={closeFormHandler}>
            Close
          </CustomButton>
        </Center>
      </Card>
    </Modal>
  );
};

export default EditProfile;
