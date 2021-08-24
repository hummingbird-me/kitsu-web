import React, { Suspense } from 'react';

import 'app/initializers';
import 'app/styles/index.css';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import ApolloContextProvider from 'app/contexts/ApolloContext';
import IntlProvider from 'app/contexts/IntlContext';
import { LayoutSettingsContextProvider } from './contexts/LayoutSettingsContext';
import Router from 'app/Router';
import Spinner from 'app/components/Spinner';
import Layout from 'app/components/Layout';

const App: React.FC = function ({ children = <Router /> }) {
  return (
    <React.StrictMode>
      <LayoutSettingsContextProvider>
        <SessionContextProvider>
          <ApolloContextProvider>
            <IntlProvider>
              <Suspense fallback={<Spinner />}>
                <Layout>{children}</Layout>
              </Suspense>
            </IntlProvider>
          </ApolloContextProvider>
        </SessionContextProvider>
      </LayoutSettingsContextProvider>
    </React.StrictMode>
  );
};

export default App;
