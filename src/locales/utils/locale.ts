import {
  type OptionsDictionary,
  type OptionsGraph,
  type TranslationKeys,
} from '@zxcvbn-ts/core';
import { type Locale as DateFnsLocale } from 'date-fns';
import { mapValues } from 'lodash-es';
import { type MessageFormatElement } from 'react-intl';

type KitsuLocale = Record<string, MessageFormatElement[]>;

type ZxcvbnLocale = {
  translations: TranslationKeys;
  dictionary: OptionsDictionary;
  graph: OptionsGraph;
};

export enum LocaleStatus {
  /** The locale has at least 99% string coverage */
  'COMPLETE',
  /** The locale has at least 80% string coverage */
  'BETA',
  /** The locale has less than 80% string coverage */
  'INCOMPLETE',
}

export type LocaleBundles = {
  main: {
    kitsu: KitsuLocale;
    dateFns: DateFnsLocale;
  };
  zxcvbn: ZxcvbnLocale;
};

export type Locale = {
  /** The name of the locale */
  name: string;
  /** The IETF locale code */
  code: string;
  /** Specifies how complete the locale is */
  status: LocaleStatus;
  /** Load the locale data */
  bundles: {
    [key in keyof LocaleBundles]: () => Promise<LocaleBundles[key]>;
  };
};

export function defineLocale({
  name,
  code,
  status,
  bundles: bundleLoaders,
}: {
  name: string;
  code: string;
  status: LocaleStatus;
  bundles: {
    [key in keyof LocaleBundles]: () => Promise<{
      default: LocaleBundles[key];
    }>;
  };
}): Locale {
  return {
    name,
    code,
    status,
    bundles: mapValues(bundleLoaders, (loader, key) => {
      return Object.defineProperty(
        async () => (await loader()).default,
        'name',
        {
          value: `loadLocaleBundle(${code}/${key})`,
        },
      );
    }) as unknown as Locale['bundles'],
  };
}
