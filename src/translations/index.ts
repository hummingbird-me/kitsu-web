import { mapKeys } from 'lodash-es';
import { MessageFormatElement } from 'react-intl';

const translationFiles = import.meta.glob('./*.json');

const translations: Record<
  string,
  () => Promise<Record<string, { default: MessageFormatElement[] }>>
> = mapKeys(translationFiles, (_value, key) =>
  key.replace(/^\.\/(.*)\.json$/, '$1')
);

export default translations;
