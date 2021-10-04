import React, { useReducer } from 'react';
import { useCookie, useEvent, useAsync } from 'react-use';
import { IntlProvider } from 'react-intl';
import preferredLocale from 'preferred-locale';

import translations from 'app/translations';

type LocaleState = {
  locale: string;
  setLocale: (locale: string) => void;
  unsetLocale: () => void;
};

function useLocaleState(locale: string): LocaleState {
  const [cookie, setCookie, unsetCookie] = useCookie('chosenLocale');
  const availableLocales = Object.keys(translations);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  if (locale) {
    return { locale, setLocale: setCookie, unsetLocale: unsetCookie };
  } else if (cookie) {
    // Listen for language change
    useEvent('languagechange', forceUpdate, window);

    // If the user has chosen an invalid locale, delete it
    if (cookie && availableLocales.indexOf(locale) === -1) {
      unsetCookie();
    }

    return { locale: cookie, setLocale: setCookie, unsetLocale: unsetCookie };
  } else {
    const availableLocales = Object.keys(translations);
    return {
      locale: preferredLocale(availableLocales, 'en'),
      setLocale: setCookie,
      unsetLocale: unsetCookie,
    };
  }
}

const LocaleContext = React.createContext<{
  locale: string;
  setLocale: (locale: string) => void;
  unsetLocale: () => void;
}>({
  locale: 'en',
  setLocale: () => null,
  unsetLocale: () => null,
});

const IntlContext: React.FC<{ locale: string }> = function ({
  children,
  locale,
}) {
  const value = useLocaleState(locale);
  const { loading, value: messages } = useAsync(translations[value.locale]);

  return loading ? null : (
    <LocaleContext.Provider value={value}>
      <IntlProvider
        locale={value.locale}
        messages={messages?.default}
        key={value.locale}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

export default IntlContext;

export function useLocale(): LocaleState {
  return React.useContext(LocaleContext);
}
