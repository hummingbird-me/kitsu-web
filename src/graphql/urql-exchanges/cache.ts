import { cacheExchange as graphcacheExchange } from '@urql/exchange-graphcache';

import resolvers from '@/graphql/resolvers';
import schema from '@/graphql/schema.urql.json';

import optimistic from '../optimistic-mutations';

export default function cacheExchange() {
  return graphcacheExchange({
    optimistic,
    schema,
    keys: {
      Image: () => null,
      ImageView: () => null,
      TitlesList: () => null,
    },
    resolvers,
  });
}
