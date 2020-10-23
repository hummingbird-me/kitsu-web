export default function momentLocale(localeInput = 'en') {
  let locale = localeInput;
  // Fix for Acadian not having a unique language code
  if (locale === 'mis-ca') locale = 'fr-ca';

  // https://github.com/moment/moment/tree/2.27.0/locale
  const momentLocales = [
    'af', 'ar-dz', 'ar-kw', 'ar-ly', 'ar-ma', 'ar-sa', 'ar-tn', 'ar', 'az',
    'be', 'bg', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'cs', 'cv', 'cy', 'da',
    'de-at', 'de-ch', 'de', 'dv', 'el', 'en-au', 'en-ca', 'en-gb', 'en-ie',
    'en-il', 'en-in', 'en-nz', 'en-sg', 'en', 'eo', 'es-do', 'es-us', 'es',
    'et', 'eu', 'fa', 'fi', 'fil', 'fo', 'fr-ca', 'fr-ch', 'fr', 'fy', 'ga',
    'gd', 'gl', 'gom-deva', 'gom-latn', 'gu', 'he', 'hi', 'hr', 'hu', 'hy-am',
    'id', 'is', 'it-ch', 'it', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ku',
    'ky', 'lb', 'lo', 'lt', 'lv', 'me', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms-my',
    'ms', 'mt', 'my', 'nb', 'ne', 'nl-be', 'nl', 'nn', 'oc-lnc', 'pa-in',
    'pl', 'pt-br', 'pt', 'ro', 'ru', 'sd', 'se', 'si', 'sk', 'sl', 'sq',
    'sr-cyrl', 'sr', 'ss', 'sv', 'sw', 'ta', 'te', 'tet', 'tg', 'th', 'tk',
    'tl-ph', 'tlh', 'tr', 'tzl', 'tzm-latn', 'tzm', 'ug-cn', 'uk', 'ur',
    'uz-latn', 'uz', 'vi', 'x-pseudo', 'yo', 'zh-cn', 'zh-hk', 'zh-mo',
    'zh-tw'
  ];

  // Check if language is supported without a region
  if (!momentLocales.some(momentLocale => locale === momentLocale)) {
    const language = locale.split('-')[0];
    if (momentLocales.some(momentLocale => language === momentLocale)) {
      locale = language;
    } else {
      locale = 'en';
    }
  }

  return locale || 'en';
}
