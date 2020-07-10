import LANGUAGES from './languages';

// Naïve ponyfill for Safari's lack of Intl.Locale support - https://caniuse.com/#search=Intl%3A%20Locale
const localeMax = locale => ('Locale' in Intl ? new Intl.Locale(locale).maximize() : { language: locale });
const localeMin = locale => ('Locale' in Intl ? new Intl.Locale(locale).minimize() : { language: locale.split('-')[0] });

/* Remove duplicate language-region locales */
const deduplicate = array => {
  switch (typeof array[0]) {
    case 'string':
      return array.filter((item, index) => array.indexOf(item) === index);
    case 'object':
      return array.filter(
        (v, i, a) => a.findIndex(t => t.locale === v.locale) === i
      );
    default:
      return array;
  }
};

const translatedLocales = LANGUAGES.map(locale => locale.id);
const browserLocales = deduplicate(navigator.languages.concat(['en-US']));

/* Check if we support any regional varient from the browser languages */
const isLanguageSupported = (translatedLocales, locale, index, array) => translatedLocales
  .filter(translatedLocale => {
    // Strip the region code from both locales (en-gb -> en)
    const supportedLanguage = localeMin(translatedLocale).language;
    const unifiedBrowserLanguage = localeMin(locale).language;
    // Update the locale field to the canonical region if we don't
    // have translations for the browser-provided language region
    // For example, en-xx (unknown region) to en-us (supported)
    const languageSupported = supportedLanguage === unifiedBrowserLanguage;
    // eslint-disable-next-line no-param-reassign
    if (languageSupported) array[index].locale = translatedLocale;
    return languageSupported;
  });

/* Use the Internaltionalisation API to transform the locales to a consistent format */
const unifiedBrowserLocales = deduplicate(
  browserLocales.map((locale, index) => {
    const unified = localeMax(locale);
    const localeString = unified.region
      ? `${unified.language}-${unified.region}`
      : unified.language;
    return {
      locale: localeString.toLowerCase(),
      priority: index
    };
  })
);

/* Restrict translated locales to those provided by the browser */
const supportedLocales = unifiedBrowserLocales.filter(
  (locale, index, array) => {
    // Escape early if the language and region match exactly
    if (translatedLocales.includes(locale.locale)) return true;
    // Check if we support another regional varient of the language
    return isLanguageSupported(translatedLocales, locale.locale, index, array);
  }
);

export default supportedLocales[0].locale;
