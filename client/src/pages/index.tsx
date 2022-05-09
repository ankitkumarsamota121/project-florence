import type { NextPage } from 'next';
// import { withApollo } from '../utils/withApollo';
// import { useHelloQuery } from '../generated/graphql';
// import { get } from 'lodash';
import { SimpleGrid, Center, Button, Image } from '@chakra-ui/react';
// import { getDataFromTree } from '@apollo/client/react/ssr';

const Home: NextPage = () => {
  // const { data } = useHelloQuery();
  // const hello = get(data, 'hello', 'hello');
  return (
    <SimpleGrid columns={2} spacing={10} minH='80vh'>
      <Center
        display='flex'
        flexDirection='column'
        px={32}
        fontSize='xl'
        textAlign='center'
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia
        felis vitae aliquam pharetra. Ut auctor facilisis venenatis. Quisque
        convallis vitae mauris in tincidunt.
        <Button colorScheme='teal' variant='outline' size='lg' px={16} mt={8}>
          Join Now
        </Button>
      </Center>
      <Center px={8}>
        <Image
          src='https://img.freepik.com/free-vector/medical-workers-analyzing-electronic-record_1262-19834.jpg?w=2000&t=st=1650476146~exp=1650476746~hmac=a90bf228285afad32ef68b93718166541b0418c5e73e87dd0d6e43115aba6771'
          alt='Medical Workers Illustration'
        />
      </Center>
    </SimpleGrid>
  );
};

export default Home;
// export default withApollo(Home); // Runs the query on client side
// export default withApollo(Home, { getDataFromTree }); // Runs the query on ssr
