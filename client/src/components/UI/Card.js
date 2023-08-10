import { Box } from '@chakra-ui/react';

const Card = ({ children, ...styles }) => {
  return (
    <Box bg="white" boxShadow="xl" borderRadius="lg" {...styles}>
      {children}
    </Box>
  );
};

export default Card;
