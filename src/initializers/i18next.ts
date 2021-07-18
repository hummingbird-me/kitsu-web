import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(ICU)
  .init({
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
