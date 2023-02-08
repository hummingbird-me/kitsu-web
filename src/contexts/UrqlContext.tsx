import { devtoolsExchange } from '@urql/devtools';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import React from 'react';
import {
  Exchange,
  Provider,
  createClient,
  dedupExchange,
  fetchExchange,
} from 'urql';

import { apiHost } from 'app/constants/config';
import { useLocale } from 'app/contexts/IntlContext';
import { useSession } from 'app/contexts/SessionContext';
import resolvers from 'app/graphql/resolvers';
import schema from 'app/graphql/schema';
import authExchange from 'app/graphql/urql-exchanges/auth';
import buildAcceptLanguage from 'app/utils/buildAcceptLanguage';

const UrqlContext: React.FC = function ({ children }): JSX.Element {
  const session = useSession();
  const { locale } = useLocale();

  const storage = makeDefaultStorage({
    idbName: 'kitsu-cache',
    maxAge: 7,
  });
  const client = createClient({
    suspense: true,
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      offlineExchange({
        storage,
        schema,
        keys: {
          Image: () => null,
          ImageView: () => null,
          TitlesList: () => null,
        },
        resolvers,
      }),
      authExchange(session),
      fetchExchange,
    ],
    url: `${apiHost}api/graphql`,
    fetchOptions: {
      headers: { 'Accept-Language': buildAcceptLanguage(locale) },
    },
  });

  return <Provider value={client}>{children}</Provider>;
};
export default UrqlContext;
