import { InMemoryCache, makeVar } from '@apollo/client';
import { tokenVar } from './tokenManager';


export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        token: {
          read() {
            return tokenVar();
          },
        },
      },
    },
  },
});
