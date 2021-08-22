import React, { Suspense } from 'react';

import 'app/initializers';
import 'app/styles/index.css';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import ApolloContextProvider from 'app/contexts/ApolloContext';
import IntlProvider from 'app/contexts/IntlContext';
import Router from 'app/Router';
import Spinner from 'app/components/Spinner';

const App: React.FC = function ({ children = <Router /> }) {
  return (
    <React.StrictMode>
      <SessionContextProvider>
        <ApolloContextProvider>
          <IntlProvider>
            <Suspense fallback={<Spinner />}>{children}</Suspense>
          </IntlProvider>
        </ApolloContextProvider>
      </SessionContextProvider>
    </React.StrictMode>
  );
};

export default App;
