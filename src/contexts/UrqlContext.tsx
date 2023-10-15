import { devtoolsExchange } from '@urql/devtools';
import React from 'react';
import { createClient, fetchExchange, Provider } from 'urql';

import { apiHost } from 'app/constants/config';
import { useLocale } from 'app/contexts/IntlContext';
import { useSession } from 'app/contexts/SessionContext';
import authExchange from 'app/graphql/urql-exchanges/auth';
import cacheExchange from 'app/graphql/urql-exchanges/cache';
import buildAcceptLanguage from 'app/utils/buildAcceptLanguage';

if (import.meta.hot) {
  // HMR causes issues with urql, so we reload the page instead
  import.meta.hot.accept(() => location.reload());
}

export default function UrqlContext({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const session = useSession();
  const { locale } = useLocale();

  const client = createClient({
    suspense: true,
    exchanges: [
      devtoolsExchange,
      cacheExchange(),
      authExchange(session),
      fetchExchange,
    ],
    url: `${apiHost}api/graphql`,
    fetchOptions: {
      headers: { 'Accept-Language': buildAcceptLanguage(locale) },
    },
  });

  return <Provider value={client}>{children}</Provider>;
}
