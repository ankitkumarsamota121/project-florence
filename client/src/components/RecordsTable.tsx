import { Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import React from 'react';
import Record from './Record';

interface Props {}

const RecordsTable = (props: Props) => {
  const record = {
    title: 'Other diseases of spleen',
    category: 'S75119D',
    description:
      ' Minor laceration of femoral vein at hip and thigh level unspecified leg, subsequent encounter',
  };
  return (
    <Table variant='striped' colorScheme='teal'>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Category</Th>
          <Th>Description</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Record
          title={record.title}
          category={record.category}
          description={record.description}
        />
        <Record
          title={record.title}
          category={record.category}
          description={record.description}
        />
        <Record
          title={record.title}
          category={record.category}
          description={record.description}
        />
      </Tbody>
    </Table>
  );
};

export default RecordsTable;
