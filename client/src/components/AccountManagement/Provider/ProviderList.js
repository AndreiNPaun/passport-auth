import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../../utils/authorizationLinks';

import { Container, Box, Text, Divider } from '@chakra-ui/react';
import httpRequest from '../../../utils/httpRequest';
import Card from '../../UI/Card';
import CustomButton from '../../UI/CustomButton';

const ProviderList = () => {
  const [userData, setUserData] = useState([]);

  const location = useLocation();
  const providerName = location.state?.providerName;

  const authorizationLinks = {
    Microsoft: MicrosoftAuthorisation,
    Google: GoogleAuthorisation,
    GitHub: GithubAuthorisation,
    LinkedIn: LinkedInAuthorisation,
  };

  const providerAuthorizationLink = authorizationLinks[providerName];

  useEffect(() => {
    try {
      (async () => {
        const response = await httpRequest(
          'get',
          `${process.env.REACT_APP_SERVER_URL}/list-providers`,
          { provider: providerName }
        );

        console.log('list resp', response);

        setUserData(response.data);
      })();
    } catch (error) {
      console.log('Error', error);
    }
  }, []);

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
              <CustomButton h="2rem" m="1rem 0">
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
