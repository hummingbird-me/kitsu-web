import { defineLocale, LocaleStatus } from '../../utils/locale';

export default defineLocale({
  code: 'en-US',
  name: 'English (United States)',
  status: LocaleStatus.COMPLETE,
  bundles: {
    main: () => import('./main.bundle'),
    zxcvbn: () => import('./zxcvbn.bundle'),
  },
});
