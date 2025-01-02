import '@testing-library/jest-dom/vitest';

import {
  render as _render,
  cleanup,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { beforeEach } from 'vitest';

import { DateFnsLocaleContext, LocaleContext } from 'app/contexts/IntlContext';
import enUS from 'app/locales/bundles/en-US/header';

const main = await enUS.bundles.main();

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
      <DateFnsLocaleContext.Provider value={main.dateFns}>
        <IntlProvider locale="en-US" key="en-US" messages={main.kitsu}>
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
