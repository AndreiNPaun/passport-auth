import { Box } from '@chakra-ui/react';

const Card = ({ children, ...props }) => {
  return (
    <Box bg="white" boxShadow="xl" borderRadius="lg" {...props}>
      {children}
    </Box>
  );
};

export default Card;
