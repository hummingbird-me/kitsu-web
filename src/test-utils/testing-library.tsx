import React from 'react';
import {
  cleanup,
  render as _render,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { beforeEach } from 'vitest';
import { IntlProvider } from 'react-intl';
import { mapValues } from 'lodash-es';

import _messages from 'app/locales/translations/en-US.json';

const messages = mapValues(_messages, 'message');

const Provider: React.FC = function ({ children }) {
  return (
    // eslint-disable-next-line i18next/no-literal-string
    <IntlProvider locale="en-US" messages={messages}>
      {children}
    </IntlProvider>
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
