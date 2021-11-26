import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

interface RecordProps {
  title: string;
  category: string;
  description: string;
}

const Record = ({ title, category, description }: RecordProps) => {
  return (
    <Tr>
      <Td>{title}</Td>
      <Td>{category}</Td>
      <Td>{description}</Td>
      <Td></Td>
    </Tr>
  );
};

export default Record;
