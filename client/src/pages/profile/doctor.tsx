import {
  Container,
  Grid,
  GridItem,
  Heading,
  Box,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
} from '@chakra-ui/react';
import { get } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import UserInfoTable from '../../components/UserInfoTable';
import { useMeQuery } from '../../generated/graphql';

interface DoctorProfileProps {}

const DoctorProfile = (props: DoctorProfileProps) => {
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
              <Tab _focus={{ outline: 'none' }}>My Patients</Tab>
              {/* <Tab _focus={{ outline: 'none' }}>Notifications</Tab> */}
            </TabList>

            <TabPanels>
              <TabPanel>
                {/* <RecordsTable /> */}
                {/* <Button colorScheme='teal' mt={4} width='200px' height='50px'>
                  Add Record
                </Button> */}
                <h1>Patients</h1>
              </TabPanel>
              {/* <TabPanel>
                <h1>Notifications</h1>
              </TabPanel> */}
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DoctorProfile;
