import { InfoIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import React from 'react';
import { Patient as PatientType } from '../generated/graphql';

interface PatientsTableProps {
  patients: PatientType[];
}

const PatientsTable = ({ patients }: PatientsTableProps) => {
  return (
    <Table variant='striped' colorScheme='teal'>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {patients.map((patient, idx) => (
          <Tr key={idx}>
            <Td>{patient.name}</Td>
            <Td>{patient.email}</Td>
            <Td>
              <NextLink href={`/view/patient/${patient.id}`}>
                <InfoIcon />
              </NextLink>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default PatientsTable;
