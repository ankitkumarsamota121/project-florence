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
import React, { useState } from 'react';
import NextLink from 'next/link';
import RecordsTable from '../../../components/RecordsTable';
import UserInfoTable from '../../../components/UserInfoTable';
import {
  useGetPatientRecordsQuery,
  useGetPatientsQuery,
} from '../../../generated/graphql';

interface Props {}

const PatientInfo = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const patientId = router.query.patientId as string;

  const { data: patientsData, loading: loadingPatients } = useGetPatientsQuery({
    fetchPolicy: 'cache-first',
  });
  let patients = get(patientsData, 'getPatients', []);
  let patient = filter(patients, (p) => p.id === patientId)[0];

  const {
    data: recordsData,
    loading: loadingRecords,
    refetch: refetchRecords,
  } = useGetPatientRecordsQuery({ variables: { patientId } });
  let records = get(recordsData, 'getPatientRecords', []);

  const refetchHandler = async () => {
    setLoading(true);
    const { data: recordsData } = await refetchRecords();
    records = get(recordsData, 'getRecords', []);
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
            {loadingPatients || loading ? (
              <Spinner />
            ) : (
              <>
                <UserInfoTable user={patient} />
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
                {loadingRecords || loading ? (
                  <Spinner />
                ) : (
                  <RecordsTable records={records} />
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
