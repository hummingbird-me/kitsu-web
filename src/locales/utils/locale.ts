import { MessageFormatElement } from 'react-intl';
import { Locale as DateFnsLocale } from 'date-fns';

type KitsuLocale = Record<string, MessageFormatElement[]>;

export enum LocaleStatus {
  /** The locale has at least 99% string coverage */
  'COMPLETE',
  /** The locale has at least 80% string coverage */
  'BETA',
  /** The locale has less than 80% string coverage */
  'INCOMPLETE',
}

export type Locale = {
  /** The name of the locale */
  name: string;
  /** Specifies how complete the locale is */
  status: LocaleStatus;
  /** Load the locale data */
  load: () => Promise<{
    kitsu: KitsuLocale;
    dateFns: DateFnsLocale;
  }>;
};

export function defineLocale({
  kitsu: loadKitsuLocale,
  dateFns: loadDateFnsLocale,
  ...other
}: {
  name: string;
  status: LocaleStatus;
  kitsu: () => Promise<{ default: unknown }>;
  dateFns: () => Promise<{ default: DateFnsLocale }>;
}): Locale {
  return {
    ...other,
    load: async () => {
      const [{ default: kitsu }, { default: dateFns }] = await Promise.all([
        loadKitsuLocale(),
        loadDateFnsLocale(),
      ]);
      return { kitsu: kitsu as unknown as KitsuLocale, dateFns };
    },
  };
}
