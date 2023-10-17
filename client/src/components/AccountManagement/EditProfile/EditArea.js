import React from 'react';
import { Box, Text, Grid, VStack, Center } from '@chakra-ui/react';

import Card from '../../UI/Card';
import CustomButton from '../../UI/CustomButton';

const EditArea = ({ userData, showFormHandler }) => {
  return (
    <Card mb="1rem" overflow="hidden">
      <Grid templateColumns="30% 70%" gap="1rem">
        <Box p="1rem" borderRight="1px solid" borderColor="gray.300">
          <Text fontSize="2xl" mt="2rem">
            Personal Information
          </Text>
          <Text mt="1rem">
            This section contains private user data. Ensure accuracy and
            confidentiality.
          </Text>
        </Box>
        <Box p="1rem" m="0 4rem">
          <Grid templateColumns="repeat(2, 1fr)" gap="2rem" m="1rem 0">
            {[
              { label: 'First Name', value: userData?.givenName },
              { label: 'Last Name', value: userData?.familyName },
              { label: 'Role', value: userData?.role },
            ].map(({ label, value }) => (
              <VStack alignItems="start" key={label}>
                <Text fontSize="xl" color="blue.500" mb="0.5rem">
                  {label}
                </Text>
                <Text fontSize="xl">{value}</Text>
              </VStack>
            ))}
          </Grid>
          <Center mt="2rem">
            <CustomButton m="0 1rem" onClick={showFormHandler}>
              Edit Information
            </CustomButton>
            <CustomButton m="0 1rem" bg="#cf0f04" _hover={{ bg: '#7c0902' }}>
              Delete Account
            </CustomButton>
          </Center>
        </Box>
      </Grid>
    </Card>
  );
};

export default EditArea;
