import { get } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import InfoTable from '../../../components/InfoTable';
import Wrapper from '../../../components/Wrapper';
import { useGetRecordQuery } from '../../../generated/graphql';
import {
  Center,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import ErrorDialog from '../../../components/ErrorDialog';

const RecordInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorIsOpen, setErrorIsOpen] = useState(false);
  const router = useRouter();
  const recordId = parseInt(router.query.recordId as string);

  const {
    data: recordData,
    loading: recordLoading,
    error: recordError,
    refetch: refetchRecord,
  } = useGetRecordQuery({ variables: { getRecordId: recordId } });
  let record = get(recordData, 'getRecord.record', {});
  let attachments = get(recordData, 'getRecord.attachments', []);

  useEffect(() => {
    if (recordLoading) setLoading(true);
    else if (recordError) {
      let errorMsg = '';
      if (recordError) errorMsg = recordError.message;
      setError(errorMsg);
    } else {
      setLoading(false);
      setError('');
    }
  }, [recordLoading, recordError]);

  return (
    <Wrapper>
      <ErrorDialog
        error={error}
        setIsOpen={setErrorIsOpen}
        isOpen={errorIsOpen}
      />
      <Center>
        <Text fontSize='4xl'>Record Info</Text>
      </Center>
      <InfoTable data={record} variant='striped' />

      <Center>
        <Text fontSize='4xl'>Attachments</Text>
      </Center>
      <Table variant='striped' colorScheme='teal'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attachments.map((attachment: any, idx: any) => (
            <Tr key={idx}>
              <Td>{attachment.id}</Td>
              <Td>12/12/12</Td>
              <Td>
                <a href={attachment.url} target='_blank'>
                  <InfoIcon />
                </a>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Wrapper>
  );
};

export default RecordInfo;
