import React from 'react';
import {
  createClient,
  Provider,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from 'urql';

import authExchange from 'app/urql-exchanges/auth';
import { useSession } from 'app/contexts/SessionContext';
import { useLocale } from 'app/contexts/IntlContext';
import { apiHost } from 'app/constants/config';
import buildAcceptLanguage from 'app/utils/buildAcceptLanguage';

const UrqlContext: React.FC = function ({ children }): JSX.Element {
  const session = useSession();
  const { locale } = useLocale();

  const client = createClient({
    suspense: true,
    exchanges: [
      dedupExchange,
      cacheExchange,
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
