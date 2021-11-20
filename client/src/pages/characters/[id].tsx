import { get } from 'lodash';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { withApollo } from 'src/lib/withApollo';
import { useCharacterQuery } from 'src/generated';

function SingleCharacterPage({ query }) {
  const id = get(query, 'id');

  const { data } = useCharacterQuery({
    variables: {
      id,
    },
  });

  return <div>{JSON.stringify(data)}</div>;
}

export default withApollo(SingleCharacterPage, { getDataFromTree });
