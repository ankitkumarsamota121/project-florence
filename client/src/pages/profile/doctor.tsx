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
import ErrorDialog from '../../components/ErrorDialog';

const DoctorProfile = () => {
  const [error, setError] = useState('');
  const [errorIsOpen, setErrorIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: meData, loading: meLoading, error: meError } = useMeQuery();
  const userInfo = get(meData, 'me', null);

  const {
    data: patientsData,
    loading: patientsLoading,
    error: patientsError,
    refetch: refetchPatients,
  } = useGetPatientsQuery();
  let patients = get(patientsData, 'getPatients', []);

  useEffect(() => {
    if (meLoading || patientsLoading) setLoading(true);
    else if (meError || patientsLoading) {
      let errorMsg = '';
      if (meError) errorMsg = meError.message;
      if (patientsError) errorMsg = patientsError.message;
      setError(errorMsg);
    } else {
      setLoading(false);
      setError('');
    }
  }, [meLoading, patientsLoading, meError, patientsError]);

  useEffect(() => {
    if (!loading) {
      const curr = router.pathname;
      const path = `/profile/${userInfo?.userType.toLowerCase()}`;
      if (curr !== path) router.push('/');
    }
  }, [loading]);

  const refetchHandler = async () => {
    setLoading(true);
    const { data: patientsData } = await refetchPatients();
    patients = get(patientsData, 'getPatients', []);
    setLoading(false);
  };

  return (
    <Container maxW='container.xl'>
      <ErrorDialog
        isOpen={errorIsOpen}
        setIsOpen={setErrorIsOpen}
        error={error}
      />
      <Grid templateColumns='repeat(6, 1fr)' gap={8} mt={4} fontSize='sm'>
        <GridItem colSpan={2}>
          <Heading size='xl' fontWeight='medium'>
            Doctor Profile
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
