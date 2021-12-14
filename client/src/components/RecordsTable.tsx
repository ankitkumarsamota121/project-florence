import { Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import React from 'react';
import Record from './Record';

interface RecordsTableProps {
  patientId: string;
  records:
    | never[]
    | {
        __typename?: string | undefined;
        id: string;
        title: string;
        description: string;
        category: string;
        isAuthorized?: boolean;
      }[];
}

/*
never[] | 
{ 
  __typename?: "Record" | undefined; 
  id: string; 
  title: string; description: string; category: string; }[]
*/

const RecordsTable = ({ records, patientId }: RecordsTableProps) => {
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
            recordId={parseInt(record.id)}
            patientId={patientId}
            title={record.title}
            category={record.category}
            description={record.description}
            isAuthorized={
              record.isAuthorized !== undefined ? record.isAuthorized : true
            }
          />
        ))}
      </Tbody>
    </Table>
  );
};

export default RecordsTable;
