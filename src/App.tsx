import React, { Suspense } from 'react';

import 'app/initializers';
import 'app/styles/index.css';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import UrqlContextProvider from 'app/contexts/UrqlContext';
import IntlProvider from 'app/contexts/IntlContext';
import { LayoutSettingsContextProvider } from './contexts/LayoutSettingsContext';
import { AccountSettingsContextProvider } from 'app/contexts/AccountSettingsContext';
import { ToasterContextProvider } from 'app/components/Toaster/Context';
import Router from 'app/Router';
import Spinner from 'app/components/Spinner';
import Layout from 'app/components/Layout';

const App: React.FC = function ({ children = <Router /> }) {
  return (
    <React.StrictMode>
      <Suspense fallback={<Spinner />}>
        <LayoutSettingsContextProvider>
          <SessionContextProvider>
            <UrqlContextProvider>
              <IntlProvider>
                <AccountSettingsContextProvider>
                  <ToasterContextProvider>
                    <Layout>{children}</Layout>
                  </ToasterContextProvider>
                </AccountSettingsContextProvider>
              </IntlProvider>
            </UrqlContextProvider>
          </SessionContextProvider>
        </LayoutSettingsContextProvider>
      </Suspense>
    </React.StrictMode>
  );
};

export default App;
