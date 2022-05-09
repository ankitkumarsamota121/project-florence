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
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import ErrorDialog from '../../components/ErrorDialog';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Wrapper from '../../components/Wrapper';

const PatientProfile = () => {
  const [error, setError] = useState('');
  const [errorIsOpen, setErrorIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const router = useRouter();

  const { data: meData, loading: meLoading, error: meError } = useMeQuery();
  let userInfo = get(meData, 'me', null);

  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useGetRecordsQuery();
  let records = get(recordsData, 'getRecords', []);

  const {
    data: requestsData,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useGetConsentRequestsQuery();
  let requests = get(requestsData, 'getConsentRequests', []);

  useEffect(() => {
    if (meLoading || recordsLoading || requestsLoading) setLoading(true);
    else if (meError || recordsError || requestsError) {
      let errorMsg = '';
      if (meError) errorMsg = meError.message;
      if (recordsError) errorMsg = recordsError.message;
      if (requestsError) errorMsg = requestsError.message;
      setError(errorMsg);
    } else {
      setLoading(false);
      setError('');
    }
  }, [
    meLoading,
    recordsLoading,
    requestsLoading,
    meError,
    recordsError,
    requestsError,
  ]);

  useEffect(() => {
    if (!loading) {
      const curr = router.pathname;
      const path = `/profile/${userInfo?.userType.toLowerCase()}`;
      if (curr !== path) router.push('/');
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      setErrorIsOpen(true);
    } else {
      setErrorIsOpen(false);
    }
  }, [error]);

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
    setLoadingAccess(true);
    try {
      if (granted) {
        await grantAccess({
          variables: { recordId: parseInt(recordId), doctorId },
        });
      }
      await deleteConsentRequest({
        variables: { deleteConsentRequestId: parseInt(consentRequestId) },
      });
      await refetchHandler();
    } catch (error: any) {
      setError(error.message);
    }

    setLoadingAccess(false);
  };

  return (
    <>
      <Container maxW='container.xl' minH='80vh' p={0}>
        <ErrorDialog
          isOpen={errorIsOpen}
          setIsOpen={setErrorIsOpen}
          error={error}
        />
        <Grid templateColumns='repeat(6, 1fr)' gap={12} mt={4} fontSize='sm'>
          <GridItem colSpan={2}>
            {/* <Flex alignItems='center' justifyContent='space-around' px={16}>
              <Box> */}
            <Heading>Patient Profile</Heading>
            {/* </Box>
            </Flex> */}

            <Box boxShadow='md' borderRadius={8} p={4}>
              {loading ? (
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
                  {loading ? (
                    <Spinner />
                  ) : (
                    <RecordsTable
                      patientId={userInfo!.user.id}
                      records={records}
                    />
                  )}
                  <NextLink href={`/add/record/${userInfo?.user.id}`}>
                    <Button
                      colorScheme='teal'
                      mt={4}
                      width='200px'
                      height='50px'
                    >
                      Add Record
                    </Button>
                  </NextLink>
                </TabPanel>
                <TabPanel>
                  {loading ? (
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
    </>
  );
};

export default PatientProfile;
