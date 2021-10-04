import React from 'react';
import { StaticRouter } from 'react-router';
import { addParameters } from '@storybook/react';
import { map } from 'lodash-es';
import { useLocale } from 'storybook-addon-locale';
import { withDirection } from 'storybook-rtl-addon';

import KitsuTheme from './KitsuTheme';
import UrqlContextProvider from 'app/contexts/UrqlContext';
import IntlProvider from 'app/contexts/IntlContext';
import translations from 'app/translations';
import 'app/styles/index.css';

const locales = (() => {
  const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
  return Object.fromEntries(
    Object.keys(translations).map((key) => [
      key,
      {
        name: displayNames.of(key),
        text: displayNames.of(key),
      },
    ])
  );
})();

addParameters({
  locales,
  defaultLocale: 'en-US',
});

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
  docs: { theme: KitsuTheme },
};

export const decorators = [
  withDirection,
  (Story) => {
    const locale = useLocale();
    return (
      <React.StrictMode>
        <React.Suspense fallback={null}>
          <StaticRouter location={{}}>
            <IntlProvider locale={locale}>
              <UrqlContextProvider>
                <Story />
              </UrqlContextProvider>
            </IntlProvider>
          </StaticRouter>
        </React.Suspense>
      </React.StrictMode>
    );
  },
];
