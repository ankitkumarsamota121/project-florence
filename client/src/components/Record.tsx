import { InfoIcon, LockIcon } from '@chakra-ui/icons';
import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

interface RecordProps {
  title: string;
  category: string;
  description: string;
  isAuthorized: boolean;
}

const Record = ({
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
      <Td>{isAuthorized ? <InfoIcon /> : <LockIcon />}</Td>
    </Tr>
  );
};

export default Record;
