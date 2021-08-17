import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(ICU)
  .use({
    type: 'backend',
    read(
      language: string,
      namespace: string,
      callback: (
        errorValue: null | Error,
        translations: null | Record<string, unknown>
      ) => void
    ) {
      const translations =
        namespace === '__default'
          ? import(`../translations/${language}.yaml`)
          : import(`../translations/${language}/${namespace}.yaml`);

      translations
        .then((resources) => {
          callback(null, resources);
        })
        .catch((error) => {
          callback(error, null);
        });
    },
  })
  .init({
    defaultNS: '__default',
    detection: {
      order: ['querystring', 'cookie', 'navigator'],
      caches: ['cookie'],
      lookupCookie: 'locale',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
