import { Table, Tbody, Tr, Td } from '@chakra-ui/react';
import React from 'react';
import { User } from '../generated/graphql';

interface Props {
  user?: User;
}

const UserInfoTable = ({ user }: Props) => {
  return (
    <Table variant='simple'>
      <Tbody>
        {user &&
          Object.entries(user).map((key, value) =>
            key[0] === '__typename' ? (
              <></>
            ) : (
              <Tr key={value}>
                <Td fontWeight='bold' px={2} py={4}>
                  {key[0].toUpperCase().replace('_', ' ')}
                </Td>
                <Td px={2} py={4}>
                  {key[1]}
                </Td>
              </Tr>
            )
          )}
      </Tbody>
    </Table>
  );
};

export default UserInfoTable;
