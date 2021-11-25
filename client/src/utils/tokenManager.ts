import { gql, makeVar } from '@apollo/client';
import { cache } from './cache';
export const tokenVar = makeVar('');

export const setToken = (token: string) => {
  cache.evict({ id: 'ROOT_QUERY', fieldName: 'me' });
  localStorage.setItem('token', token);
  tokenVar(token);
};

// export const getToken = gql`
//   query Hello {
//     token @client
//   }
// `;

// To get a token use => useReactiveVar(tokenVar);

export const removeToken = () => {
  tokenVar('');
  localStorage.removeItem('token');
};
