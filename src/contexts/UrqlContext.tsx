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
import { apiHost } from 'app/constants/config';

const UrqlContext: React.FC = function ({ children }): JSX.Element {
  const session = useSession();

  const client = createClient({
    suspense: true,
    exchanges: [
      dedupExchange,
      cacheExchange,
      authExchange(session),
      fetchExchange,
    ],
    url: `${apiHost}/api/graphql`,
  });

  return <Provider value={client}>{children}</Provider>;
};
export default UrqlContext;
