import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import 'app/initializers';
import 'app/styles/index.css';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import ApolloContextProvider from 'app/contexts/ApolloContext';
import IntlProvider from 'app/contexts/IntlContext';
import Router from 'app/Router';
import Spinner from 'app/components/Spinner';

ReactDOM.render(
  <React.StrictMode>
    <SessionContextProvider>
      <ApolloContextProvider>
        <IntlProvider>
          <BrowserRouter>
            <Suspense fallback={<Spinner />}>
              <Router />
            </Suspense>
          </BrowserRouter>
        </IntlProvider>
      </ApolloContextProvider>
    </SessionContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
