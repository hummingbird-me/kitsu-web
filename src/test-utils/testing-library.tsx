/* eslint-disable i18next/no-literal-string */
import React from 'react';
import {
  cleanup,
  render as _render,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { beforeEach } from 'vitest';
import { IntlProvider } from 'react-intl';

import { DateFnsLocaleContext, LocaleContext } from 'app/contexts/IntlContext';
import enUS from 'app/locales/bundles/en-US.header';
const localeData = await enUS.load();

const Provider: React.FC = function ({ children }) {
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
  options?: RenderOptions
): RenderResult {
  return _render(ui, { wrapper: Provider, ...options });
}

// Tell Vitest to clean up after each test
beforeEach(cleanup);

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
