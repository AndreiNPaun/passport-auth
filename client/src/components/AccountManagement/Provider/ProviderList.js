import React, { useState } from 'react';

import { useSubmit } from 'react-router-dom';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../../utils/authorizationLinks';

import { Container, Box, Text, Divider } from '@chakra-ui/react';
import Card from '../../UI/Card';
import CustomButton from '../../UI/CustomButton';

const ProviderList = ({ list, providerName }) => {
  const [userData, setUserData] = useState(list);

  const submit = useSubmit();

  const authorizationLinks = {
    Microsoft: MicrosoftAuthorisation,
    Google: GoogleAuthorisation,
    GitHub: GithubAuthorisation,
    LinkedIn: LinkedInAuthorisation,
  };

  const providerAuthorizationLink = authorizationLinks[providerName];

  const deleteConnectionHandler = (providerID, providerType) => {
    const proceed = window.confirm(
      'Are you sure you wish to delete this connection?'
    );

    if (proceed) {
      submit({ providerID, providerType }, { method: 'post' });

      const updatedUserData = userData.filter((data) => data.id !== providerID);
      setUserData(updatedUserData);
    }
  };

  return (
    <Container mt="4rem" maxW="60%">
      <Card mt="1rem">
        <Text p="1rem">Provider: {providerName}</Text>
        <CustomButton
          h="2rem"
          m="0 1rem"
          onClick={() => providerAuthorizationLink(true)}
        >
          Add more
        </CustomButton>
        {userData.length === 0 && (
          <Text p="1rem">No accounts linked from this provider.</Text>
        )}
        {Array.isArray(userData) &&
          userData.length > 0 &&
          userData.map((data) => (
            <Box key={data.id} p="1rem">
              <Box>
                {data.email && <Text>Email: {data.email}</Text>}
                {data.givenName && <Text>First name: {data.givenName}</Text>}
                {data.familyName && <Text>Last name: {data.familyName}</Text>}
                {data.username && <Text>Username: {data.username}</Text>}
              </Box>
              <CustomButton
                h="2rem"
                m="1rem 0"
                onClick={() => deleteConnectionHandler(data.id, providerName)}
              >
                Delete
              </CustomButton>
              <Divider mt="1rem" />
            </Box>
          ))}
      </Card>
    </Container>
  );
};

export default ProviderList;
