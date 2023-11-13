import React from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';

import CustomButton from '../../UI/CustomButton';

const ProviderGridItem = ({
  color,
  Icon,
  authorizationFunction,
  name,
  is1130,
  onShowList,
}) => {
  return is1130 ? (
    // Return for large screens
    <Grid
      templateColumns="auto 1fr auto auto"
      gap="1rem"
      mb="1.5rem"
      alignItems="center"
      p="1rem"
      bg="white"
      boxShadow="sm"
      borderRadius="5px"
      border="1px solid"
      borderColor="gray.200"
    >
      <Box bg={color} p="0.5rem" borderRadius="5px">
        <Icon size="1.5em" color="white" />
      </Box>
      <Text fontSize="xl" fontWeight="600" color="gray.700">
        {name}
      </Text>
      <CustomButton onClick={() => authorizationFunction(true)}>
        Add
      </CustomButton>
      <CustomButton onClick={() => onShowList(name)}>
        See Connections
      </CustomButton>
    </Grid>
  ) : (
    // Return for small screens
    <Grid
      key={name}
      templateColumns="auto 1fr"
      templateRows="auto auto auto"
      gap="1rem"
      mb="1.5rem"
      alignItems="center"
      p="1rem"
      bg="white"
    >
      <Box bg={color} p="0.5rem" borderRadius="5px">
        <Icon size="1.5em" color="white" />
      </Box>
      <Text fontSize="xl" fontWeight="600" color="gray.700">
        {name}
      </Text>
      <CustomButton
        onClick={() => authorizationFunction(true)}
        gridColumn="span 2"
      >
        Add
      </CustomButton>
      <CustomButton onClick={() => onShowList(name)} gridColumn="span 3">
        See Connections
      </CustomButton>
    </Grid>
  );
};

export default ProviderGridItem;
