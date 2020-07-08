import LANGUAGES from './languages';

const isString = value => typeof value === 'string';

const transformLocale = locale => locale.toLowerCase().split('-');

const equaliseLocale = (supported, preferred) => {
  let i = 0;
  const supportedLength = supported.length;
  const preferredLength = preferred.length;
  const minimumLength = Math.min(supportedLength, preferredLength);

  for (let j = minimumLength; i < j && supported[i] === preferred[i]; i += 1);
  return i > 0 ? (2 / (supportedLength - i + 1) + 1 / (preferredLength - i + 1)) / 3 : 0;
};

const nearestLocale = (supportedLocales, preferredLocales) => {
  if (!supportedLocales.length) return null;

  const transformedSupportedLocales = supportedLocales.map(transformLocale);
  let nearestEquality = 0;
  let nearestSupportedLocaleIndex = 0;

  Array.from(preferredLocales).some(preferredLocale => {
    if (!isString(preferredLocale)) return;

    const transformedPreferredLocale = transformLocale(preferredLocale);

    return transformedSupportedLocales.some((supportedLocale, supportedLocaleIndex) => {
      const equality = equaliseLocale(supportedLocale, transformedPreferredLocale);
      if (equality > nearestEquality) {
        nearestEquality = equality;
        nearestSupportedLocaleIndex = supportedLocaleIndex;
      }
      return nearestEquality === 1;
    });
  });
  return supportedLocales[nearestSupportedLocaleIndex];
};

export default nearestLocale(LANGUAGES.map(locale => locale.id), navigator.languages || ['en-us']);
