# Locale Data

Kitsu has locale data from multiple sources (currently our own strings in react-intl format plus
date-fns locale data) which we want in a single chunk, plus we have some metadata about each locale
we would like to have in the main chunk.

To that end, we have our own system of "header files" which provide metadata and a function to
dynamically load the locale chunks. These are stored in the `./headers` directory, and automatically
loaded by `./index.ts`.

## Localization

Localization of Kitsu is done using our localization service, Crowdin. Any changes made there will
be automatically synced into our Git repository, in the `./translations` directory.

### For Existing Locales

Changes to existing locales will be reflected in our next deploy. If we haven't deployed your
changes after a few days, feel free to ask a dev on Discord, we're generally more than happy to
help!

### Releasing a new locale

If a locale has reached a point where it is usable (generally at least 50% complete), then it can be
released to users. To do this, create a new file in `./headers/` with the following format:

```typescript
import { defineLocale, LocaleStatus } from '../utils/locale';

export default defineLocale({
  /**
   * The name of your locale to display in selector
   */
  name: 'English (United States)',
  /**
   * How complete is your translation?
   *
   *   INCOMPLETE < 80%
   *   BETA       < 99%
   *   COMPLETE   >= 99%
   */
  status: LocaleStatus.INCOMPLETE,
  /**
   * Load the translations file
   *
   * NOTE: this is always the same locale code as your header filename */
  kitsu: () => import('../translations/en-US.json'),
  /**
   * Pick your date-fns locale
   *
   * WARNING: they may not have your first choice locale!
   * Select from: https://github.com/date-fns/date-fns/tree/master/src/locale
   *
   * If they don't have a good option, you can contribute to them by following this guide:
   * https://date-fns.org/v2.25.0/docs/I18n-Contribution-Guide
   */
  dateFns: () => import('date-fns/locale/en-US'),
});
```
