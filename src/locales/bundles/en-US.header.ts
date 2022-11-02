import { defineLocaleHeader, LocaleStatus } from '../utils/LocaleHeader';

export default defineLocaleHeader({
  name: 'English (United States)',
  status: LocaleStatus.COMPLETE,
  load: () => import('./en-US'),
});
