import type { NextPage } from 'next';
import { withApollo } from '../utils/withApollo';
import { useHelloQuery } from '../generated/graphql';
import { get } from 'lodash';
import { Heading } from '@chakra-ui/react';
// import { getDataFromTree } from '@apollo/client/react/ssr';

const Home: NextPage = () => {
  const { data } = useHelloQuery();
  const hello = get(data, 'hello', 'hello');
  return <Heading as='h1'>{hello}</Heading>;
};

export default Home;
// export default withApollo(Home); // Runs the query on client side
// export default withApollo(Home, { getDataFromTree }); // Runs the query on ssr
