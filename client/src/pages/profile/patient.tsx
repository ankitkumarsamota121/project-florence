import React, { useEffect } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import RecordsTable from '../../components/RecordsTable';
import UserInfoTable from '../../components/UserInfoTable';
import { useMeQuery } from '../../generated/graphql';
import { get } from 'lodash';
import { useRouter } from 'next/dist/client/router';

interface PatientProfileProps {}

const PatientProfile = (props: PatientProfileProps) => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const userInfo = get(meData, 'me', null);
  const router = useRouter();

  useEffect(() => {
    const curr = router.pathname;
    const path = `/profile/${userInfo?.userType.toLowerCase()}`;
    if (curr !== path) router.push('/');
  }, [meLoading]);
  return (
    <Container maxW='container.xl'>
      <Grid templateColumns='repeat(6, 1fr)' gap={8} mt={4} fontSize='sm'>
        <GridItem colSpan={2}>
          <Heading size='xl' fontWeight='medium'>
            User Profile
          </Heading>
          <Box boxShadow='md' borderRadius={8} centerContent p={4}>
            {meLoading ? (
              <Spinner />
            ) : (
              <>
                <UserInfoTable user={userInfo?.user} />
                <Button
                  colorScheme='teal'
                  variant='outline'
                  mt={4}
                  width='100%'
                  height='50px'
                >
                  Refetch
                </Button>
              </>
            )}
          </Box>
        </GridItem>
        <GridItem colSpan={4}>
          <Tabs isFitted colorScheme='teal'>
            <TabList>
              <Tab _focus={{ outline: 'none' }}>Records</Tab>
              <Tab _focus={{ outline: 'none' }}>Notifications</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <RecordsTable />
                <NextLink href='/addRecord/patient'>
                  <Button colorScheme='teal' mt={4} width='200px' height='50px'>
                    Add Record
                  </Button>
                </NextLink>
              </TabPanel>
              <TabPanel>
                <h1>Notifications</h1>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default PatientProfile;
