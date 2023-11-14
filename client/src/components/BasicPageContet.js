import React from 'react';
import { Center, Text, Box, VStack } from '@chakra-ui/react';

const BasicPageContent = ({ title, message }) => {
  return (
    <Center height="30vh" flexDirection="column">
      <VStack spacing={4}>
        <Text fontSize="4xl" fontWeight="bold" color="gray.700">
          {title}
        </Text>
        <Box px={4}>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            {message}
          </Text>
        </Box>
      </VStack>
    </Center>
  );
};

export default BasicPageContent;
