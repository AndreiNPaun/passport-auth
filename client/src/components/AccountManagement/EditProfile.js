import React, { useState } from 'react';
import { useSubmit, useActionData, useNavigation } from 'react-router-dom';

import Modal from '../UI/Modal';
import { Center, Box, Text, List, ListItem, ListIcon } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

import CustomButton from '../UI/CustomButton';
import Card from '../UI/Card';
import InputFields from '../UI/InputFields';

const EditProfile = (props) => {
  const submit = useSubmit();
  const data = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  console.log('dataz', data);

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

    props.updateDisplayedUserData(userDataInput);

    const givenName = userDataInput.givenName;
    const familyName = userDataInput.familyName;
    const email = userDataInput.email;

    submit({ givenName, familyName, email }, { method: 'post' });

    props.updateFormStatus();
  };

  const closeFormHandler = () => {
    props.updateFormStatus();
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
        {data && data.errors && (
          <List spacing=".5rem" m="1rem 0 1rem 2.5rem">
            {data.errors.map((err, index) => (
              <ListItem key={index}>
                <ListIcon as={WarningIcon} color="red.500" />
                {err}
              </ListItem>
            ))}
          </List>
        )}

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
          <CustomButton
            m="1rem"
            type="submit"
            onClick={submitFormHandler}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </CustomButton>
          <CustomButton
            m="1rem"
            onClick={closeFormHandler}
            disabled={isSubmitting}
          >
            Close
          </CustomButton>
        </Center>
      </Card>
    </Modal>
  );
};

export default EditProfile;
