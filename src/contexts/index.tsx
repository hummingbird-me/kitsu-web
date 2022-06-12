import React from 'react';

import IntlProvider from './IntlContext';
import UrqlContextProvider from './UrqlContext';

import { SessionContextProvider } from './SessionContext';
import { AccountContextProvider } from './AccountContext';
import { ToasterContextProvider } from 'app/components/Toaster/Context';

const ApplicationContext: React.FC = function ({ children }) {
  return (
    <SessionContextProvider>
      <UrqlContextProvider>
        <IntlProvider>
          <AccountContextProvider>
            <ToasterContextProvider>{children}</ToasterContextProvider>
          </AccountContextProvider>
        </IntlProvider>
      </UrqlContextProvider>
    </SessionContextProvider>
  );
};
export default ApplicationContext;
