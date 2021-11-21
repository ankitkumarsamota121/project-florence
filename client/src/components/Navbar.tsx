import { gql, useQuery } from '@apollo/client';
import { Button, Flex, Link, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React from 'react';
// import { tokenVar } from '../utils/cache';
import { getToken, removeToken } from '../utils/tokenManager';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const { data } = useQuery(getToken);
  const router = useRouter();

  const logoutHandler = () => {
    removeToken();
    router.push('/');
  };

  return (
    <Flex backgroundColor='grey' py={4}>
      <Spacer />
      {data.token ? (
        <NextLink href='/'>
          <Button mr={4} onClick={logoutHandler}>
            Logout
          </Button>
        </NextLink>
      ) : (
        <>
          <NextLink href='/register'>
            <Link mr={4}>Register</Link>
          </NextLink>
          <NextLink href='/login'>
            <Link mr={4}>Login</Link>
          </NextLink>
        </>
      )}
    </Flex>
  );
};

export default Navbar;
