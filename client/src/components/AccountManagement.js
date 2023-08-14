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

import Card from './UI/Card';
import InputFields from './UI/InputFields';
import CustomButton from './UI/ButtonUI';

const MyProfile = () => {
  return (
    <Container mt="4rem" maxW="75%">
      <Card mb="1rem">
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
              <GridItem>
                <Text fontSize="xl" color="blue.500">
                  First Name
                </Text>
                <Text fontSize="xl">Andrei</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="xl" color="blue.500">
                  Family Name
                </Text>
                <Text fontSize="xl">Paun</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="xl" color="blue.500">
                  Email
                </Text>
                <Text fontSize="xl">andreinicolaepaun@gmail.com</Text>
              </GridItem>
            </Grid>

            <Flex align="center" justify="start" m="2rem 0 0 1rem">
              <CustomButton>Edit Information</CustomButton>
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
            <Grid
              templateColumns="10% 70% 10% 10%"
              mb="0.5rem"
              h="3.5rem"
              w="45vw"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="5px"
            >
              <GridItem
                bg="#0078D4"
                borderTopLeftRadius="5px"
                borderBottomLeftRadius="5px"
              >
                <Center height="100%">
                  <FaMicrosoft size="2em" color="white" />
                </Center>
              </GridItem>
              <GridItem
                m="0.7rem 1rem"
                fontSize="xl"
                fontWeight="600"
                color="gray.700"
              >
                Microsoft
              </GridItem>
              <GridItem mt="1rem">Sync</GridItem>
              <GridItem mt="1rem">Delete</GridItem>
            </Grid>

            <Grid
              templateColumns="10% 70% 10% 10%"
              mb="0.5rem"
              h="3.5rem"
              w="45vw"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="5px"
            >
              <GridItem
                bg="#DB4437"
                borderTopLeftRadius="5px"
                borderBottomLeftRadius="5px"
              >
                <Center height="100%">
                  <FaGoogle size="2em" color="white" />
                </Center>
              </GridItem>
              <GridItem
                m="0.7rem 1rem"
                fontSize="xl"
                fontWeight="600"
                color="gray.700"
              >
                Google
              </GridItem>
              <GridItem mt="1rem">Sync</GridItem>
              <GridItem mt="1rem">Delete</GridItem>
            </Grid>

            <Grid
              templateColumns="10% 70% 10% 10%"
              mb="0.5rem"
              h="3.5rem"
              w="45vw"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="5px"
            >
              <GridItem
                bg="#181717"
                borderTopLeftRadius="5px"
                borderBottomLeftRadius="5px"
              >
                <Center height="100%">
                  <FaGithub size="2em" color="white" />
                </Center>
              </GridItem>
              <GridItem
                m="0.7rem 1rem"
                fontSize="xl"
                fontWeight="600"
                color="gray.700"
              >
                GitHub
              </GridItem>
              <GridItem mt="1rem">Sync</GridItem>
              <GridItem mt="1rem">Delete</GridItem>
            </Grid>

            <Grid
              templateColumns="10% 70% 10% 10%"
              mb="0.5rem"
              h="3.5rem"
              w="45vw"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="5px"
            >
              <GridItem
                bg="#0A66C2"
                borderTopLeftRadius="5px"
                borderBottomLeftRadius="5px"
              >
                <Center height="100%">
                  <FaLinkedin size="2em" color="white" />
                </Center>
              </GridItem>
              <GridItem
                m="0.7rem 1rem"
                fontSize="xl"
                fontWeight="600"
                color="gray.700"
              >
                LinkedIn
              </GridItem>
              <GridItem mt="1rem">Sync</GridItem>
              <GridItem mt="1rem">Delete</GridItem>
            </Grid>
          </Box>
        </Grid>
      </Card>
    </Container>
  );
};

export default MyProfile;
