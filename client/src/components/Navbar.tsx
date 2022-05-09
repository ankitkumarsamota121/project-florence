import { useReactiveVar } from '@apollo/client';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { get } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { useMeQuery } from '../generated/graphql';
import { removeToken, tokenVar } from '../utils/tokenManager';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const token = useReactiveVar(tokenVar);

  const { data: meData, refetch: meRefetch } = useMeQuery({
    nextFetchPolicy: 'cache-first',
  });
  let userInfo = get(meData, 'me', {} as any);

  const logoutHandler = async () => {
    removeToken();
    router.push('/');
  };

  useEffect(() => {
    setLoading(true);
    const fn = async () => {
      const { data: nmeData, error } = await meRefetch();
      userInfo = get(nmeData, 'me', {} as any);
      setLoading(false);
    };
    if (token) fn();
  }, [token]);

  return (
    <Flex backgroundColor='lightblue' py={4}>
      <Text fontSize='3xl' ml={4}>
        <Link href='/'>florence</Link>
      </Text>
      <Spacer />
      {token ? (
        <Menu>
          <MenuButton
            as={Button}
            mr={4}
            rightIcon={<ChevronDownIcon />}
            isLoading={loading}
          >
            {userInfo?.user?.name}
          </MenuButton>
          <MenuList>
            <MenuItem>
              <NextLink href={`/profile/${userInfo?.userType?.toLowerCase()}`}>
                <Box w='100%'>Profile</Box>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <NextLink href='/'>
                <Box w='100%' onClick={logoutHandler}>
                  Logout
                </Box>
              </NextLink>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <>
          <Menu>
            <MenuButton as={Button} mr={4} rightIcon={<ChevronDownIcon />}>
              Register
            </MenuButton>
            <MenuList>
              <MenuItem>
                <NextLink href='/register/patient'>Register Patient</NextLink>
              </MenuItem>
              <MenuItem>
                <NextLink href='/register/doctor'>Register Doctor</NextLink>
              </MenuItem>
            </MenuList>
          </Menu>
          <NextLink href='/login'>
            <Button mr={4}>Login</Button>
          </NextLink>
        </>
      )}
    </Flex>
  );
};

export default Navbar;
