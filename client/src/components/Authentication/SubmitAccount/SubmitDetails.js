import React, { useState } from 'react';

import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Text,
  Center,
  Box,
  FormControl,
  Link,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import Card from '../../UI/Card';
import HttpRequest from '../../../utils/HttpRequest';
import InputFields from '../../UI/InputFields';
import CustomButton from '../../UI/CustomButton';

const SubmitDetails = () => {
  const navigate = useNavigate();

  const [userDataInput, setUserDataInput] = useState({
    givenName: '',
    familyName: '',
  });
  const [isError, setIsError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDataChangeHandler = (event) => {
    const { name, value } = event.target;
    setUserDataInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const urlParams = new URLSearchParams(window.location.search);

  const provider = urlParams.get('provider');

  const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    const givenName = userDataInput.givenName;
    const familyName = userDataInput.familyName;
    const email = userDataInput.email;

    const userInputData = { givenName, familyName, email };

    try {
      const response = await HttpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/complete-setup`,
        { userInputData }
      );

      console.log('response', response);

      if (response.status === 200) {
        setIsSubmitting(false);
        navigate(`/login-check?isLoggedIn=true&${response.data}`);
      } else {
        navigate('/account-management');
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data)
      ) {
        setIsError(error.response.data);
      } else {
        console.log('KEKZ');
        navigate('/');
      }
      setIsSubmitting(false);
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
        <FormControl>
          <InputFields
            htmlFor="givenName"
            labelText="First Name"
            id="givenName"
            name="givenName"
            required
            value={userDataInput.givenName}
            onChange={userDataChangeHandler}
          />

          <InputFields
            htmlFor="familyName"
            labelText="Last Name"
            id="familyName"
            name="familyName"
            required
            value={userDataInput.familyName}
            onChange={userDataChangeHandler}
          />

          <Center>
            <CustomButton
              mt="1.5rem"
              w="8rem"
              onClick={submitFormHandler}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </CustomButton>
          </Center>
        </FormControl>
      </Card>
    </Center>
  );
};

export default SubmitDetails;
