import { get } from '@ember/object';

export function getTitleField(preference) {
  switch (preference) {
    case 'english':
      return 'en';
    case 'romanized':
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
  const key = getTitleField(preference);
  return key !== undefined ? get(context, `titles.${key}`) || get(context, 'canonicalTitle')
    : get(context, 'canonicalTitle');
}

export default {
  getTitleField,
  getComputedTitle
};
