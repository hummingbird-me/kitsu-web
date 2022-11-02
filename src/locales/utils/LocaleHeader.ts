import { LocaleBundle } from './LocaleBundle';

export enum LocaleStatus {
  /** The locale has at least 99% string coverage */
  'COMPLETE',
  /** The locale has at least 80% string coverage */
  'BETA',
  /** The locale has less than 80% string coverage */
  'INCOMPLETE',
}

export type LocaleHeader = {
  /** The name of the locale */
  name: string;
  /** Specifies how complete the locale is */
  status: LocaleStatus;
  /** Load the locale data */
  load: () => Promise<LocaleBundle>;
};

/**
 * Define a locale object (encapsulating locale info and loading functions)
 */
export function defineLocaleHeader({
  load,
  ...other
}: {
  /** The name of the locale */
  name: string;
  /** Specifies how complete this locale is */
  status: LocaleStatus;
  /** Load the bundle */
  load: () => Promise<{ default: unknown }>;
}): LocaleHeader {
  return {
    ...other,
    load: async () => {
      const { default: locale } = await load();
      return locale as unknown as LocaleBundle;
    },
  };
}
