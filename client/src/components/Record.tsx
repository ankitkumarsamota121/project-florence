import { InfoIcon, LockIcon } from '@chakra-ui/icons';
import { Td, Tr } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import ConsentRequest from './ConsentRequest';

interface RecordProps {
  recordId: number;
  patientId: string;
  title: string;
  category: string;
  description: string;
  isAuthorized: boolean;
}

const Record = ({
  recordId,
  patientId,
  title,
  category,
  description,
  isAuthorized,
}: RecordProps) => {
  return (
    <Tr>
      <Td>{title}</Td>
      <Td>{category}</Td>
      <Td>{description}</Td>
      <Td>
        <NextLink href={`/view/record/${recordId}`}>
          {isAuthorized ? (
            <InfoIcon />
          ) : (
            <ConsentRequest recordId={recordId} patientId={patientId} />
          )}
        </NextLink>
      </Td>
    </Tr>
  );
};

export default Record;
