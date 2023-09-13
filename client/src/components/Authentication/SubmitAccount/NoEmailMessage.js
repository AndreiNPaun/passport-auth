import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Text, Center, Box, Link } from '@chakra-ui/react';
import Card from '../../UI/Card';

const NoEmailMessage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const provider = urlParams.get('provider');
  const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

  return (
    <>
      <Center h="95vh">
        <Card p="2rem" w="40%">
          <Text
            p="1rem"
            m="0 auto"
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            color="blue.600"
          >
            Missing Email
          </Text>

          <Center>
            <Text mb=".5rem" color="#181717">
              Your email address could not be retrieved from&nbsp;
              <Box as="span" fontWeight="bold" color="blue.600">
                {providerText}
              </Box>
              &nbsp;either because it is missing or because it is set to
              private. Please go to the provider account settings and change
              email visibility to public.
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
              &nbsp;to go back and select another platform.
            </Text>
          </Center>
        </Card>
      </Center>
    </>
  );
};

export default NoEmailMessage;
