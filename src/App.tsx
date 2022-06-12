import React, { Suspense } from 'react';

import 'app/initializers';
import 'app/styles/index.css';

import ApplicationContext from 'app/contexts';
import { LayoutSettingsContextProvider } from './contexts/LayoutSettingsContext';
import Router from 'app/Router';
import Layout from 'app/components/Layout';

const App: React.FC = function ({ children = <Router /> }) {
  return (
    <React.StrictMode>
      <Suspense fallback={null}>
        <LayoutSettingsContextProvider>
          <ApplicationContext>
            <Layout>{children}</Layout>
          </ApplicationContext>
        </LayoutSettingsContextProvider>
      </Suspense>
    </React.StrictMode>
  );
};

export default App;
