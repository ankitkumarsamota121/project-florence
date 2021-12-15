import { AppProps } from 'next/app';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { ApolloClient, ApolloProvider, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { cache } from '../utils/cache';
import { tokenVar } from '../utils/tokenManager';
import validateToken from '../utils/validateToken';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${
        localStorage.getItem('token') || tokenVar() || null
      }`,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  connectToDevTools: true,
  link: from([authLink, httpLink, errorLink]),
  cache,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      tokenVar(token);
      validateToken(token);
    }
  }

  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme} resetCSS>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default MyApp;
