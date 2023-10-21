/* eslint-disable i18next/no-literal-string */

import '@testing-library/jest-dom/vitest';

import {
  render as _render,
  cleanup,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { beforeEach } from 'vitest';

import { DateFnsLocaleContext, LocaleContext } from 'app/contexts/IntlContext';
import enUS from 'app/locales/headers/en-US';

const localeData = await enUS.load();

const Provider = function ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <LocaleContext.Provider
      value={{
        locale: 'en-US',
        setLocale: () => null,
        unsetLocale: () => null,
      }}>
      <DateFnsLocaleContext.Provider value={localeData.dateFns}>
        <IntlProvider locale="en-US" key="en-US" messages={localeData.kitsu}>
          {children}
        </IntlProvider>
      </DateFnsLocaleContext.Provider>
    </LocaleContext.Provider>
  );
};

function render(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  options?: RenderOptions,
): RenderResult {
  return _render(ui, { wrapper: Provider, ...options });
}

// Tell Vitest to clean up after each test
beforeEach(cleanup);

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
