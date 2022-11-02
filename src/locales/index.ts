import { mapKeys, mapValues } from 'lodash-es';
import { LocaleHeader } from './utils/LocaleHeader';

const localeHeaders = import.meta.globEager('./bundles/*.header.ts');

const locales: Record<string, LocaleHeader> = mapValues(
  mapKeys(localeHeaders, (_value, key) =>
    key.replace(/^\.\/bundles\/(.*)\.header\.ts$/, '$1')
  ),
  (module) => module.default
);

export default locales;
