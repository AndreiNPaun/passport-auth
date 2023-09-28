import React from 'react';

import { useLocation } from 'react-router-dom';

import { Container, Text } from '@chakra-ui/react';
import Card from '../../UI/Card';

const ProviderList = () => {
  const location = useLocation();
  const providerName = location.state?.providerName;

  console.log('provider', location);
  return (
    <Container mt="4rem" maxW="60%">
      <Card mt="1rem">
        <Text p="1rem">Provider: {providerName}</Text>
      </Card>
    </Container>
  );
};

export default ProviderList;
