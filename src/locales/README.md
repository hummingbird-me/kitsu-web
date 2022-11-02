# Locale Data

Kitsu has locale data from multiple sources (currently our own strings in react-intl format plus
date-fns locale data) which we want in a single chunk, plus we have some metadata about each locale
we would like to have in the main chunk.

To that end, we have our own system of "header files" which provide metadata and "bundle files"
which bundle the actual locale data. These are both stored in the `./bundles` directory with the
bundle being named `cc-LL.ts` (reflecting IETC BCP 47 locale identifiers) and the header being named
the same but with a `.header.ts` suffix. The header files are automatically imported by `./index.ts`
into the main application chunk, and the locale bundle files are loaded separately at app startup or
locale change.

## Localization

Kitsu has many different elements involved in localization, but the one we always want help with is
translation of application strings. This is done using our localization service, Crowdin, and any
changes accepted on there will be automatically synced into our Git repository, in the `./strings`
directory.

Beyond the translation of Kitsu application strings, a complete localization also requires:

**date-fns locale** — This is our library for formatting dates and times. They have [many locales
already available][date-fns-locales] but if you don't see the locale you need, you can [contribute a
new locale to them][date-fns-locale-contrib].

[date-fns-locales]: https://github.com/date-fns/date-fns/tree/master/src/locale
[date-fns-locale-contrib]: https://date-fns.org/v2.25.0/docs/I18n-Contribution-Guide

**zxcvbn locale** — This is our library for judging password strength. That might sound odd, but
different countries and languages often have different "bad" passwords. As with date-fns, they
already have [many locales available][zxcvbn-locales] but if you don't see the locale you need, you
can contribute it to them. This is a bit more involved than date-fns because it isn't just a matter
of translating strings, but also gathering common words and names and passwords, so feel free to
skip it and leave it to us!

[zxcvbn-locales]: https://zxcvbn-ts.github.io/zxcvbn/guide/languages/

### For Existing Locales

Changes to existing locales will be reflected in our next deploy. If we haven't deployed your
changes after a few days, feel free to ask a dev on Discord, we're generally more than happy to
help!

### Releasing a new locale

If a locale has reached a point where it is usable (generally at least 50% complete), then it can be
released to users. To do this, create a header file in `./bundles/` with the following format:

```typescript
// src/locales/bundles/cc-LL.header.ts
import { defineLocaleHeader, LocaleStatus } from '../utils/LocaleHeader';

export default defineLocale({
  /**
   * The name of your locale to display in selector
   */
  name: 'English (United States)',
  /**
   * How complete is your translation? Just a rough estimate is fine.
   *
   *   INCOMPLETE < 80%
   *   BETA       < 99%
   *   COMPLETE   >= 99%
   */
  status: LocaleStatus.INCOMPLETE,
  /**
   * Load the locale bundle
   */
  load: () => import('./en-US'),
});
```
