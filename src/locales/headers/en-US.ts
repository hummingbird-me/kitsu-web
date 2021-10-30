import { defineLocale, LocaleStatus } from '../utils/locale';

export default defineLocale({
  name: 'English (United States)',
  status: LocaleStatus.COMPLETE,
  kitsu: () => import('../translations/en-US.json'),
  dateFns: () => import('date-fns/locale/en-US'),
});
