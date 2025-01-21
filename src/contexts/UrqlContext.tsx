import React, { useContext, useMemo } from 'react';
import { createClient, fetchExchange, Provider } from 'urql';

import InvariantViolated from '@/errors/InvariantViolated';
import { apiHost } from 'app/constants/config';
import { useLocale } from 'app/contexts/IntlContext';
import { SessionContext } from 'app/contexts/SessionContext';
import authExchange from 'app/graphql/urql-exchanges/auth';
import cacheExchange from 'app/graphql/urql-exchanges/cache';
import buildAcceptLanguage from 'app/utils/buildAcceptLanguage';

export default function UrqlContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useLocale();
  const sessionContext = useContext(SessionContext);
  if (!sessionContext) throw new InvariantViolated('SessionContext is missing');

  const client = useMemo(
    () =>
      createClient({
        suspense: true,
        exchanges: [
          cacheExchange(),
          authExchange(sessionContext),
          fetchExchange,
        ],
        url: `${apiHost}api/graphql`,
        fetchOptions: {
          headers: { 'Accept-Language': buildAcceptLanguage(locale) },
        },
      }),
    [sessionContext, locale],
  );

  return <Provider value={client}>{children}</Provider>;
}
