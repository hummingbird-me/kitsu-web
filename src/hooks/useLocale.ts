import { useReducer, useMemo } from 'react';
import { useCookie, useEvent } from 'react-use';
import preferredLocale from 'preferred-locale';

import translations from 'app/translations';

export default function useLocale(): {
  locale: string;
  setLocale: (locale: string) => void;
  unsetLocale: () => void;
} {
  const availableLocales = Object.keys(translations);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [locale, setLocale, unsetLocale] = useCookie('chosenLocale');

  // Listen for language change
  useEvent('languagechange', forceUpdate, window);

  // If the user has chosen an invalid locale, delete it
  if (locale && availableLocales.indexOf(locale) === -1) {
    unsetLocale();
  }

  return {
    // Prefer the user's chosen locale, otherwise guess based on browser settings
    locale: useMemo(
      () => locale ?? preferredLocale(availableLocales, 'en'),
      [locale, availableLocales]
    ),
    setLocale,
    unsetLocale,
  };
}
