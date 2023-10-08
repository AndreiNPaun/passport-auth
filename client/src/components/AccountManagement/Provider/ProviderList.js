import React, { useState, useEffect } from 'react';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../../utils/authorizationLinks';

import httpRequest from '../../../utils/httpRequest';

import { Flex, Box, Text, Divider } from '@chakra-ui/react';
import Card from '../../UI/Card';
import CustomButton from '../../UI/CustomButton';

const ProviderList = ({ providerName }) => {
  const [userData, setUserData] = useState([]);

  const authorizationLinks = {
    Microsoft: MicrosoftAuthorisation,
    Google: GoogleAuthorisation,
    GitHub: GithubAuthorisation,
    LinkedIn: LinkedInAuthorisation,
  };

  const providerAuthorizationLink = authorizationLinks[providerName];

  useEffect(() => {
    (async () => {
      const response = await httpRequest(
        'get',
        `${process.env.REACT_APP_SERVER_URL}/list-providers`,
        { provider: providerName }
      );
      console.log('response', response);

      setUserData(response.data);
    })();

    console.log('user', userData);
  }, []);

  const deleteConnectionHandler = async (providerID, providerType) => {
    const proceed = window.confirm(
      'Are you sure you wish to delete this connection?'
    );

    if (proceed) {
      await httpRequest(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/delete-provider`,
        { providerID, providerType }
      );

      const updatedUserData = userData.filter((data) => data.id !== providerID);
      setUserData(updatedUserData);
    }
  };

  return (
    <Flex>
      <Card p="1rem" w="80vw" mt="10vh">
        <Text p="1rem">Provider: {providerName}</Text>
        <CustomButton
          h="2rem"
          m="0 1rem 1.5rem"
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
    </Flex>
  );
};

export default ProviderList;
