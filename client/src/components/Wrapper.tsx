import { Box } from '@chakra-ui/react';
import React from 'react';

interface WrapperProps {
  variant?: 'small' | 'regular';
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant }) => {
  return (
    <Box
      mt={8}
      mx='auto'
      maxW={
        variant === 'small' ? '400px' : variant === 'regular' ? '800px' : 'auto'
      }
      // w='100%'
      minH='80vh'
    >
      {children}
    </Box>
  );
};

export default Wrapper;
