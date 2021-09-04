import React, { useContext } from 'react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  from as linkFrom,
  HttpLink,
} from '@apollo/client';

import { apiHost } from 'app/constants/config';
import authenticationLink from 'app/apollo-links/authentication';
import acceptLanguageLink from 'app/apollo-links/acceptLanguage';
import useLocale from 'app/hooks/useLocale';

import { SessionContext } from './SessionContext';

const ApolloContext: React.FC = function ApolloContext({ children }) {
  const sessionContext = useContext(SessionContext);
  const { locale } = useLocale();

  const link = linkFrom([
    acceptLanguageLink({ locale }),
    authenticationLink(sessionContext),
    new HttpLink({ uri: `${apiHost}/api/graphql` }),
  ]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloContext;
