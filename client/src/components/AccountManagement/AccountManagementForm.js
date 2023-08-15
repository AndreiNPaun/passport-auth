import React from 'react';
import {
  Container,
  Center,
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaGoogle, FaMicrosoft } from 'react-icons/fa';

import Card from '../UI/Card';
import CustomButton from '../UI/CustomButton';

const AccountManagementForm = ({ userData, showFormHandler }) => {
  return (
    <Container mt="4rem" maxW="60%">
      <Card mb="1rem" overflow="hidden">
        <Grid templateColumns="30% 70%" gap="1rem">
          <Box p="1rem" borderRight="1px solid" borderColor="gray.300">
            <Text fontSize="2xl" mt="2rem">
              Personal Information
            </Text>
            <Text mt="1rem">
              Private user information with the option to edit the stored user
              data.
            </Text>
          </Box>
          <Box p="1rem">
            <Grid templateColumns="repeat(2, 1fr)" gap="2rem" m="1rem 0 0 1rem">
              {[
                { label: 'First Name', value: userData?.givenName },
                { label: 'Last Name', value: userData?.familyName },
                { label: 'Email', value: userData?.email },
              ].map(({ label, value }) => (
                <GridItem key={label}>
                  <Text fontSize="xl" color="blue.500">
                    {label}
                  </Text>
                  <Text fontSize="xl">{value}</Text>
                </GridItem>
              ))}
            </Grid>
            <Flex justify="end" m="1rem 3.2rem 0 0">
              <CustomButton onClick={showFormHandler}>
                Edit Information
              </CustomButton>
            </Flex>
          </Box>
        </Grid>
      </Card>

      <Card mb="1rem">
        <Grid templateColumns="30% 70%" gap="1rem">
          <Box p="1rem" borderRight="1px solid" borderColor="gray.300">
            <Text fontSize="2xl" mt="2rem">
              Connections
            </Text>
            <Text mt="1rem">
              List of existing connections and platforms yet to be connected
              with&nbsp;
              <Box as="span" fontWeight="600" color="blue.500">
                {process.env.REACT_APP_NAME}
              </Box>
              .
            </Text>
          </Box>
          <Box p="2rem">
            {[
              { color: '#0078D4', Icon: FaMicrosoft, name: 'Microsoft' },
              { color: '#DB4437', Icon: FaGoogle, name: 'Google' },
              { color: '#181717', Icon: FaGithub, name: 'GitHub' },
              { color: '#0A66C2', Icon: FaLinkedin, name: 'LinkedIn' },
            ].map(({ color, Icon, name }) => (
              <Grid
                key={name}
                templateColumns="10% 60% 15% 15%"
                mb="0.5rem"
                minH="3.5rem"
                w="95%"
                maxWidth="45vw"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="5px"
              >
                <GridItem
                  bg={color}
                  borderTopLeftRadius="5px"
                  borderBottomLeftRadius="5px"
                >
                  <Center height="100%">
                    <Icon size="2em" color="white" />
                  </Center>
                </GridItem>
                <GridItem
                  m="0.8rem"
                  fontSize="xl"
                  fontWeight="600"
                  color="gray.700"
                >
                  {name}
                </GridItem>
                <GridItem mt="1rem">Sync</GridItem>
                <GridItem mt="1rem">Delete</GridItem>
              </Grid>
            ))}
          </Box>
        </Grid>
      </Card>
    </Container>
  );
};

export default AccountManagementForm;
