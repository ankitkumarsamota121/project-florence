import { Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import React from 'react';
import { Record as RecordType } from '../generated/graphql';
import Record from './Record';

interface RecordsTableProps {
  records: RecordType[];
}

const RecordsTable = ({ records }: RecordsTableProps) => {
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
        {records.map((record, idx) => (
          <Record
            key={idx}
            title={record.title}
            category={record.category}
            description={record.description}
          />
        ))}
      </Tbody>
    </Table>
  );
};

export default RecordsTable;
