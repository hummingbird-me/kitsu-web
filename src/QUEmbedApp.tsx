import React, { Suspense } from 'react';

import 'app/initializers';
import 'app/styles/index.css';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import UrqlContextProvider from 'app/contexts/UrqlContext';
import IntlProvider from 'app/contexts/IntlContext';
import { AccountContextProvider } from 'app/contexts/AccountContext';
import Header from 'app/components/QUEmbed/Header';
import QURouter from 'app/QURouter';

const QUEmbedApp: React.FC = function ({ children = <QURouter /> }) {
  return (
    <React.StrictMode>
      <Suspense fallback={null}>
        <SessionContextProvider>
          <UrqlContextProvider>
            <IntlProvider>
              <AccountContextProvider>
                <Header />
                {children}
              </AccountContextProvider>
            </IntlProvider>
          </UrqlContextProvider>
        </SessionContextProvider>
      </Suspense>
    </React.StrictMode>
  );
};

export default QUEmbedApp;
