import React from 'react';
import { Container, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <footer>
      <Container centerContent>
        <Text textAlign='center' as='em' color='grey'>
          &copy; All rights reserved.
        </Text>
      </Container>
    </footer>
  );
};

export default Footer;
