import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import LanguageDetector from 'i18next-browser-languagedetector';

import usePromise from 'app/hooks/usePromise';

export default function setupI18n() {
  const { state } = usePromise(
    () =>
      i18next
        .use(LanguageDetector)
        .use(initReactI18next)
        .use(ICU)
        .init({
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          },
        }),
    []
  );

  return state === 'fulfilled';
}
