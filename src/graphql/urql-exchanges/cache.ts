import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';

import resolvers from 'app/graphql/resolvers';
import schema from 'app/graphql/schema';

export default function cacheExchange() {
  const storage = makeDefaultStorage({
    idbName: 'kitsu-cache',
    maxAge: 7,
  });
  return offlineExchange({
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
