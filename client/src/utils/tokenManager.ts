import { gql, makeVar } from '@apollo/client';
// import { tokenVar } from './cache';
export const tokenVar = makeVar('');

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
  tokenVar(token);
};

export const getToken = gql`
  query Hello {
    token @client
  }
`;

export const removeToken = () => {
  tokenVar('');
  localStorage.removeItem('token');
};
