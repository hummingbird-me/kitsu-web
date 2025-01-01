import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';

import resolvers from '@/graphql/resolvers';
import schema from '@/graphql/schema.urql.json';

import optimistic from '../optimistic-mutations';

export default function cacheExchange() {
  const storage = makeDefaultStorage({
    idbName: 'kitsu-cache',
    maxAge: 7,
  });
  return offlineExchange({
    optimistic,
    storage,
    schema,
    keys: {
      Image: () => null,
      ImageView: () => null,
      TitlesList: () => null,
    },
    resolvers,
  });
}
