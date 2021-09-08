import { uniq } from 'lodash-es';

export default function buildAcceptLanguage(locale: string): string {
  const languages = uniq([
    locale,
    ...(navigator.languages ?? [navigator.language]),
  ]);
  return languages
    .map((l, i) => `${l};q=${1 - i / languages.length}`)
    .join(',');
}
