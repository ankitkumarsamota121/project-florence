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
  Spacer,
} from '@chakra-ui/react';
import { get } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import AddPatient from '../../components/AddPatient';
import PatientsTable from '../../components/PatientsTable';
import { useMeQuery, useGetPatientsQuery } from '../../generated/graphql';
import InfoTable from '../../components/InfoTable';

interface DoctorProfileProps {}

const DoctorProfile = (props: DoctorProfileProps) => {
  const [loading, setLoading] = useState(false);
  const { data: meData, loading: meLoading } = useMeQuery();
  const userInfo = get(meData, 'me', null);
  const router = useRouter();

  const {
    data: patientsData,
    loading: loadingPatients,
    refetch: refetchPatients,
  } = useGetPatientsQuery();
  let patients = get(patientsData, 'getPatients', []);

  useEffect(() => {
    const curr = router.pathname;
    const path = `/profile/${userInfo?.userType.toLowerCase()}`;
    if (curr !== path) router.push('/');
  }, [meLoading]);

  const refetchHandler = async () => {
    setLoading(true);
    const { data: patientsData } = await refetchPatients();
    patients = get(patientsData, 'getPatients', []);
    setLoading(false);
  };

  return (
    <Container maxW='container.xl'>
      <Grid templateColumns='repeat(6, 1fr)' gap={8} mt={4} fontSize='sm'>
        <GridItem colSpan={2}>
          <Heading size='xl' fontWeight='medium'>
            User Profile
          </Heading>
          <Box boxShadow='md' borderRadius={8} p={4}>
            {meLoading ? (
              <Spinner />
            ) : (
              <>
                <InfoTable data={userInfo?.user} />
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
                <PatientsTable patients={patients} />
                {/* <Button colorScheme='teal' mt={4} width='200px' height='50px'>
                  Add Patient
                </Button> */}
                <Spacer mt={4} />
                <AddPatient refetchHandler={refetchHandler} />
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
