import {
  Container,
  Grid,
  GridItem,
  Heading,
  Box,
  Spinner,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { filter, get } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import RecordsTable from '../../../components/RecordsTable';
import InfoTable from '../../../components/InfoTable';
import {
  useGetPatientRecordsQuery,
  useGetPatientsQuery,
} from '../../../generated/graphql';
import ErrorDialog from '../../../components/ErrorDialog';

const PatientInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorIsOpen, setErrorIsOpen] = useState(false);
  const router = useRouter();
  const patientId = router.query.patientId as string;

  const {
    data: patientsData,
    loading: patientsLoading,
    error: patientsError,
  } = useGetPatientsQuery({
    fetchPolicy: 'cache-first',
  });
  let patients = get(patientsData, 'getPatients', []);
  let patient = filter(patients, (p) => p.id === patientId)[0];

  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useGetPatientRecordsQuery({ variables: { patientId } });
  let records = get(recordsData, 'getPatientRecords', []);

  useEffect(() => {
    if (patientsLoading || recordsLoading) setLoading(true);
    else if (patientsError || recordsError) {
      let errorMsg = '';
      if (patientsError) errorMsg = patientsError.message;
      if (recordsError) errorMsg = recordsError.message;
      setError(errorMsg);
    } else {
      setLoading(false);
      setError('');
    }
  }, [patientsLoading, recordsLoading, patientsError, recordsError]);

  const refetchHandler = async () => {
    setLoading(true);
    const { data: recordsData } = await refetchRecords();
    records = get(recordsData, 'getRecords', []);
    setLoading(false);
  };

  return (
    <Container maxW='container.xl'>
      <ErrorDialog
        error={error}
        setIsOpen={setErrorIsOpen}
        isOpen={errorIsOpen}
      />
      <Grid templateColumns='repeat(6, 1fr)' gap={8} mt={4} fontSize='sm'>
        <GridItem colSpan={2}>
          <Heading size='xl' fontWeight='medium'>
            User Profile
          </Heading>
          <Box boxShadow='md' borderRadius={8} p={4}>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <InfoTable data={patient} />
                <Button
                  colorScheme='teal'
                  variant='outline'
                  mt={4}
                  width='100%'
                  height='50px'
                  onClick={refetchHandler}
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
            </TabList>

            <TabPanels>
              <TabPanel>
                {loading ? (
                  <Spinner />
                ) : (
                  <RecordsTable patientId={patientId} records={records} />
                )}
                <NextLink href={`/add/record/${patientId}`}>
                  <Button colorScheme='teal' mt={4} width='200px' height='50px'>
                    Add Record
                  </Button>
                </NextLink>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default PatientInfo;
