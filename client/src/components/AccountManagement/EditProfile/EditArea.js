import React from 'react';

import { Box, Text, Flex, Grid, GridItem } from '@chakra-ui/react';

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
            Private user information with the option to edit the stored user
            data.
          </Text>
        </Box>
        <Box p="1rem">
          <Grid templateColumns="repeat(2, 1fr)" gap="2rem" m="1rem 0 0 1rem">
            {[
              { label: 'First Name', value: userData?.givenName },
              { label: 'Last Name', value: userData?.familyName },
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
  );
};

export default EditArea;
