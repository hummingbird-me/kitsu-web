import React from 'react';
import { useAsync } from 'react-use';
import { IntlProvider } from 'react-intl';

import useLocale from 'app/hooks/useLocale';
import translations from 'app/translations';

const IntlContext: React.FC = function ({ children }) {
  const { locale } = useLocale();

  const { loading, value: messages } = useAsync(translations[locale]);

  return loading ? null : (
    <IntlProvider locale={locale} messages={messages?.default} key={locale}>
      {children}
    </IntlProvider>
  );
};

export default IntlContext;
