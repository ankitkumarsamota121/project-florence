import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import nextWithApollo from 'next-with-apollo';
// import { makeVar } from '@apollo/client';
// export const token = makeVar(localStorage.getItem('token'));

export const withApollo = nextWithApollo(
  ({ initialState, headers }) => {
    return new ApolloClient({
      ssrMode: typeof window === 'undefined',
      link: new HttpLink({
        uri: 'http://localhost:4000/graphql',
      }),
      headers: {
        ...(headers as Record<string, string>),
        // authorization: `bearer ${token}`,
      },
      cache: new InMemoryCache({
        // typePolicies: {
        //   Query: {
        //     fields: {
        //       token: {
        //         read() {
        //           return token();
        //         },
        //       },
        //     },
        //   },
        // },
      }).restore(initialState || {}),
    });
  },
  {
    render: ({ Page, props }) => {
      // const router = useRouter();
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
