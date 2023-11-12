import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Center,
  Box,
  Text,
  List,
  ListItem,
  ListIcon,
  useMediaQuery,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

import HttpRequest from '../../../utils/HttpRequest';
import Modal from '../../UI/Modal';
import { TokenErrorFunction } from '../../../utils/TokenError';
import CustomButton from '../../UI/CustomButton';
import Card from '../../UI/Card';
import InputFields from '../../UI/InputFields';

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userDataInput, setUserDataInput] = useState({
    givenName: props.userData.givenName,
    familyName: props.userData.familyName,
    role: props.userData.role,
  });
  const [isError, setIsError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [is500] = useMediaQuery('(max-width: 500px)');

  const userDataChangeHandler = (event) => {
    const { name, value } = event.target;
    setUserDataInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    const givenName = userDataInput.givenName;
    const familyName = userDataInput.familyName;

    const userInputData = { givenName, familyName };

    try {
      await HttpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/account-management/edit-profile`,
        { userInputData }
      );

      props.closeFormHandler();
      setIsSubmitting(false);
      props.updateDisplayedUserData(userDataInput);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data)
      ) {
        setIsError(error.response.data);
      } else if (error.response.status === 401) {
        return TokenErrorFunction(dispatch, navigate);
      } else {
        setIsError(['An error occurred while updating the profile.']);
      }
      setIsSubmitting(false);
    }
  };

  const closeFormHandler = () => {
    props.closeFormHandler();
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
  ];

  return (
    <Modal onClickCancel={closeFormHandler}>
      <Card mt="20vh" w={is500 ? '80vw' : null} ml={is500 ? '-4.5rem' : null}>
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
        {isError && (
          <List spacing=".5rem" m="1rem 0 1rem 2.5rem">
            {isError.map((err, index) => (
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
