import { get } from '@ember/object';

export function getTitleField(preference, titleLocales, userLocale) {
  switch (preference) {
    case 'english':
    case 'localized':
      if (titleLocales && userLocale in titleLocales) return userLocale;
      return 'en';
    case 'romanized':
      // TODO: Bodge while originalLocale is not exposed by the JSON:API endpoint
      if (titleLocales) {
        if ('en_jp' in titleLocales) return 'en_jp';
        if ('en_cn' in titleLocales) return 'en_cn';
        if ('en_kr' in titleLocales) return 'en_kr';
      }
      return 'en_jp';
    default:
      return 'canonical';
  }
}

export function getComputedTitle(session, context) {
  if (!get(session, 'hasUser')) {
    return get(context, 'canonicalTitle');
  }
  const preference = get(session, 'account.titleLanguagePreference').toLowerCase();
  const titles = get(context, 'titles');
  const userLocale = (get(session, 'account.language') || 'en').toLowerCase().replace('-', '_');
  const key = getTitleField(preference, titles, userLocale);
  return key !== undefined ? get(context, `titles.${key}`) || get(context, 'canonicalTitle')
    : get(context, 'canonicalTitle');
}

export default {
  getTitleField,
  getComputedTitle
};
