import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Divider, useMediaQuery } from '@chakra-ui/react';

import {
  GithubAuthorisation,
  LinkedInAuthorisation,
  GoogleAuthorisation,
  MicrosoftAuthorisation,
} from '../../../utils/authorizationLinks';
import Card from '../../UI/Card';
import CustomButton from '../../UI/CustomButton';
import { TokenErrorFunction } from '../../../utils/TokenError';
import HttpRequest from '../../../utils/HttpRequest';

const ProviderList = ({ providerName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);

  const [is500] = useMediaQuery('(max-width: 500px)');

  const authorizationLinks = {
    Microsoft: MicrosoftAuthorisation,
    Google: GoogleAuthorisation,
    GitHub: GithubAuthorisation,
    LinkedIn: LinkedInAuthorisation,
  };

  const providerAuthorizationLink = authorizationLinks[providerName];

  useEffect(() => {
    (async () => {
      try {
        const response = await HttpRequest(
          'get',
          `${process.env.REACT_APP_SERVER_URL}/account-management/list-providers`,
          { provider: providerName }
        );

        setUserData(response.data);
      } catch (error) {
        TokenErrorFunction(dispatch, navigate);
      }
    })();
  }, [dispatch, navigate, providerName]);

  const deleteConnectionHandler = async (providerID, providerType) => {
    const proceed = window.confirm(
      'Are you sure you wish to delete this connection?'
    );

    if (proceed) {
      try {
        await HttpRequest(
          'post',
          `${process.env.REACT_APP_SERVER_URL}/account-management/delete-provider`,
          { providerID, providerType }
        );

        const updatedUserData = userData.filter(
          (data) => data.id !== providerID
        );
        setUserData(updatedUserData);

        window.alert('Connection deleted.');
      } catch (error) {
        if (error.response.status === 400) {
          window.alert(
            'You cannot delete this provider as this is the only connection associated to this account. Add another conection if you wish to delete this one.'
          );
        } else {
          TokenErrorFunction(dispatch, navigate);
        }
      }
    } else {
    }
  };

  return (
    <Card
      p="1rem"
      w={is500 ? '80vw' : '50vw'}
      mt="10vh"
      ml={is500 ? '-4.5rem' : '-5rem'}
    >
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
  );
};

export default ProviderList;
