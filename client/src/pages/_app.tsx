import { AppProps } from 'next/app';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { ApolloClient, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { cache } from '../utils/cache';
// import validateToken from '../utils/validateToken';
import { setToken, tokenVar } from '../utils/tokenManager';
import { validate } from 'graphql';
import validateToken from '../utils/validateToken';
// import { useEffect } from 'react';

const httpLink = createHttpLink({
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

const client = new ApolloClient({
  connectToDevTools: true,
  link: authLink.concat(httpLink),
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
