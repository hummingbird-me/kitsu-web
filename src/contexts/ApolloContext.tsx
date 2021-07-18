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
import { SessionContext } from './SessionContext';

const ApolloContext: React.FC = function ApolloContext({ children }) {
  const sessionContext = useContext(SessionContext);

  console.log('API HOST', apiHost);

  const link = linkFrom([
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
