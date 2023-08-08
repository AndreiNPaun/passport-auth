import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      // Styles for the body
      body: {
        bg: 'gray.50',
        color: 'black',
      },
    },
  },
});

export default theme;
