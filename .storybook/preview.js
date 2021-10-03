import React from 'react';
import { StaticRouter } from 'react-router';

import UrqlContextProvider from '../src/contexts/UrqlContext';
import IntlProvider from '../src/contexts/IntlContext';

import '../src/styles/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  themes: {
    clearable: false,
    default: 'light',
    list: [
      { name: 'light', class: 'theme-light', color: '#f7f7f7' },
      { name: 'dark', class: 'theme-dark', color: '#443443' },
      { name: 'oled', class: 'theme-oled', color: '#000000' },
    ],
  },
};

export const decorators = [
  (Story) => (
    <React.StrictMode>
      <React.Suspense fallback={null}>
        <StaticRouter location={{}}>
          <IntlProvider>
            <UrqlContextProvider>
              <Story />
            </UrqlContextProvider>
          </IntlProvider>
        </StaticRouter>
      </React.Suspense>
    </React.StrictMode>
  ),
];
