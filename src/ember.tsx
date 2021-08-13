import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import ApolloContextProvider from 'app/contexts/ApolloContext';

import 'app/styles/index.css';

export * as Pages from 'app/pages/ember';

export function mount(Component: any, target: HTMLElement, args: any) {
  return ReactDOM.render(
    <React.StrictMode>
      <SessionContextProvider>
        <ApolloContextProvider>
          <BrowserRouter>
            <Component {...args} />
          </BrowserRouter>
        </ApolloContextProvider>
      </SessionContextProvider>
    </React.StrictMode>,
    target
  );
}

export function unmount(target: HTMLElement) {
  return ReactDOM.unmountComponentAtNode(target);
}
