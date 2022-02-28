import React, { Suspense } from 'react';

import 'app/initializers';
import 'app/styles/index.css';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import UrqlContextProvider from 'app/contexts/UrqlContext';
import IntlProvider from 'app/contexts/IntlContext';
import { AccountSettingsContextProvider } from 'app/contexts/AccountSettingsContext';
import QURouter from 'app/QURouter';
import Layout from 'app/components/QUEmbed/Layout';

const QUEmbedApp: React.FC = function ({ children = <QURouter /> }) {
  return (
    <React.StrictMode>
      <Suspense fallback={null}>
        <SessionContextProvider>
          <UrqlContextProvider>
            <IntlProvider>
              <AccountSettingsContextProvider>
                <Layout>{children}</Layout>
              </AccountSettingsContextProvider>
            </IntlProvider>
          </UrqlContextProvider>
        </SessionContextProvider>
      </Suspense>
    </React.StrictMode>
  );
};

export default QUEmbedApp;
