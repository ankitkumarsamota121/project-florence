import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Spinner,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Text,
  Link,
  Flex,
  Stack,
  Spacer,
} from '@chakra-ui/react';
import RecordsTable from '../../components/RecordsTable';
import {
  useMeQuery,
  useGetRecordsQuery,
  useGetConsentRequestsQuery,
  useGrantAccessMutation,
  useDeleteConsentRequestMutation,
} from '../../generated/graphql';
import { get } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import InfoTable from '../../components/InfoTable';

const PatientProfile = () => {
  const [loading, setLoading] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const { data: meData, loading: meLoading } = useMeQuery();
  const userInfo = get(meData, 'me', null);
  const router = useRouter();

  const {
    data: recordsData,
    loading: loadingRecords,
    refetch: refetchRecords,
  } = useGetRecordsQuery();
  let records = get(recordsData, 'getRecords', []);

  const {
    data: requestsData,
    loading: loadingRequests,
    refetch: refetchRequests,
  } = useGetConsentRequestsQuery();
  let requests = get(requestsData, 'getConsentRequests', []);

  useEffect(() => {
    const curr = router.pathname;
    const path = `/profile/${userInfo?.userType.toLowerCase()}`;
    if (curr !== path) router.push('/');
  }, [meLoading, loadingRecords, loadingRequests]);

  const refetchHandler = async () => {
    setLoading(true);
    const { data: recordsData } = await refetchRecords();
    records = get(recordsData, 'getRecords', []);
    const { data: requestsData } = await refetchRequests();
    requests = get(requestsData, 'getConsentRequests', []);
    setLoading(false);
  };

  const [grantAccess] = useGrantAccessMutation();
  const [deleteConsentRequest] = useDeleteConsentRequestMutation();

  const requestHandler = async (
    consentRequestId: string,
    recordId: string,
    doctorId: string,
    granted: boolean
  ) => {
    setLoading(true);
    if (granted) {
      await grantAccess({
        variables: { recordId: parseInt(recordId), doctorId },
      });
    }
    await deleteConsentRequest({
      variables: { deleteConsentRequestId: parseInt(consentRequestId) },
    });
    await refetchHandler();

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
              <Tab _focus={{ outline: 'none' }}>Notifications</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {loadingRecords || loading ? (
                  <Spinner />
                ) : (
                  <RecordsTable
                    patientId={userInfo!.user.id}
                    records={records}
                  />
                )}
                <NextLink href={`/add/record/${userInfo?.user.id}`}>
                  <Button colorScheme='teal' mt={4} width='200px' height='50px'>
                    Add Record
                  </Button>
                </NextLink>
              </TabPanel>
              <TabPanel>
                {loadingRequests || loading ? (
                  <Spinner />
                ) : (
                  <VStack
                    divider={<StackDivider borderColor='gray.200' />}
                    spacing={4}
                    align='stretch'
                  >
                    {requests.map((r, idx) => (
                      <Box p={5} shadow='md' borderWidth='1px' key={idx}>
                        <Flex>
                          <Box>
                            <Text>
                              <strong>{`Dr. ${r.doctor.name}`}</strong>
                              {` has requested access to `}
                              <NextLink href={`/view/record/${r.record.id}`}>
                                <Link>
                                  <strong>Record {r.record.id}</strong>
                                </Link>
                              </NextLink>
                            </Text>
                            <Text mt={4}>
                              <strong>Message: </strong> {r.content}
                            </Text>
                          </Box>
                          <Spacer />
                          <Stack>
                            {loadingAccess ? (
                              <Spinner />
                            ) : (
                              <>
                                <Button
                                  colorScheme='teal'
                                  onClick={() =>
                                    requestHandler(
                                      r.id,
                                      r.record.id,
                                      r.doctor.id,
                                      true
                                    )
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() =>
                                    requestHandler(
                                      r.id,
                                      r.record.id,
                                      r.doctor.id,
                                      false
                                    )
                                  }
                                  colorScheme='red'
                                >
                                  Decline
                                </Button>
                              </>
                            )}
                          </Stack>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default PatientProfile;
