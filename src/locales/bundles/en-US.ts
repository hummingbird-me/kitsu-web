import dateFns from 'date-fns/locale/en-US';
import kitsu from '../strings/en-US.json';
import { defineLocaleBundle } from '../utils/LocaleBundle';

export default defineLocaleBundle({
  kitsu,
  dateFns,
  zxcvbn: () => import('@zxcvbn-ts/language-en'),
});
