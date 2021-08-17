import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { SessionContextProvider } from 'app/contexts/SessionContext';
import ApolloContextProvider from 'app/contexts/ApolloContext';

import 'app/styles/index.css';

export * as Pages from 'app/pages/ember';

export function mount(
  Component: React.ComponentType<unknown>,
  target: HTMLElement,
  args: Record<string, unknown>
): void {
  ReactDOM.render(
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

export function unmount(target: HTMLElement): void {
  ReactDOM.unmountComponentAtNode(target);
}
