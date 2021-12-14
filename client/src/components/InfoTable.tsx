import { Table, Tbody, Tr, Td } from '@chakra-ui/react';
import React from 'react';
import { User, Record } from '../generated/graphql';

interface Props {
  data: User | Record | undefined;
  variant?: string;
}

const InfoTable = ({ data, variant }: Props) => {
  return (
    <Table variant={variant || 'simple'}>
      <Tbody>
        {data &&
          Object.entries(data).map((key, idx) => {
            return key[0] === '__typename' ? (
              <></>
            ) : (
              <Tr key={idx}>
                <Td fontWeight='bold' px={2} py={4}>
                  {key[0].toUpperCase().replace('_', ' ')}
                </Td>
                <Td px={2} py={4}>
                  {key[1]}
                </Td>
              </Tr>
            );
          })}
      </Tbody>
    </Table>
  );
};

export default InfoTable;
