import React from 'react';
import {
  createClient,
  Provider,
  dedupExchange,
  fetchExchange,
  Exchange,
} from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';

import authExchange from 'app/graphql/urql-exchanges/auth';
import { useSession } from 'app/contexts/SessionContext';
import { useLocale } from 'app/contexts/IntlContext';
import { apiHost } from 'app/constants/config';
import buildAcceptLanguage from 'app/utils/buildAcceptLanguage';
import resolvers from 'app/graphql/resolvers';
import schema from 'app/graphql/schema';

const UrqlContext: React.FC = function ({ children }): JSX.Element {
  const session = useSession();
  const { locale } = useLocale();

  const client = createClient({
    suspense: true,
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange({
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
