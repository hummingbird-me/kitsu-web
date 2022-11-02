import { MessageFormatElement } from 'react-intl';
import { Locale as DateFnsLocale } from 'date-fns';
import { OptionsType as ZxcvbnLocale } from '@zxcvbn-ts/core/src/types';

type KitsuLocale = Record<string, MessageFormatElement[]>;

export type LocaleBundle = {
  /** Primary locale data */
  kitsu: KitsuLocale;
  dateFns: DateFnsLocale;
  zxcvbn: () => Promise<ZxcvbnLocale>;
};

/**
 * Define a locale bundle (encapsulating locale loading functions)
 */
export function defineLocaleBundle({
  kitsu,
  zxcvbn,
  ...other
}: {
  kitsu: unknown;
  zxcvbn: () => Promise<{ default: ZxcvbnLocale }>;
  dateFns: DateFnsLocale;
}): LocaleBundle {
  return {
    kitsu: kitsu as unknown as KitsuLocale,
    ...other,
    // Zxcvbn has a common locale we always wanna merge into the locale. Also it's pretty big and
    // only used in certain places (password forms) so it gets loaded asynchronously. Eventually we
    // should probably merge these in a build step, but it's loaded infrequently enough that
    // separate bundles should be fine.
    zxcvbn: async () => {
      const [{ default: common }, { default: localized }] = await Promise.all([
        import('@zxcvbn-ts/language-common'),
        zxcvbn(),
      ]);

      return {
        ...localized,
        dictionary: {
          ...common.dictionary,
          ...localized.dictionary,
        },
        graphs: {
          ...common.adjacencyGraphs,
          ...localized.graphs,
        },
      };
    },
  };
}
