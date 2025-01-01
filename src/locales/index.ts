import { mapKeys, mapValues } from 'lodash-es';

import { type Locale } from './utils/locale';

const translationFiles = import.meta.glob('./bundles/*/header.ts', {
  eager: true,
}) satisfies Record<string, { default: Locale }>;

const translations: Record<string, Locale> = {};

for (const key of Object.keys(translationFiles)) {
  const locale = translationFiles[key].default;
  translations[locale.code] = locale;
}

export default translations;
