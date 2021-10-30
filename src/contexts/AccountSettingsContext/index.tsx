import React, { useContext } from 'react';
import { captureException } from '@sentry/react';

import {
  TitleLanguagePreferenceEnum,
  RatingSystemEnum,
} from 'app/graphql/types';

import { useLoadAccountSettingsQuery } from './loadAccountSettings-gql';

export type AccountSettings = {
  country?: string;
  language?: string;
  timeZone?: string;
  titleLanguagePreference: TitleLanguagePreferenceEnum;
  ratingSystem: RatingSystemEnum;
  sfwFilter: boolean;
  sitePermissions: Set<string>;
  enabledFeatures: Set<string>;
};

const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  titleLanguagePreference: TitleLanguagePreferenceEnum.Canonical,
  ratingSystem: RatingSystemEnum.Simple,
  sfwFilter: false,
  sitePermissions: new Set(),
  enabledFeatures: new Set(),
};

export const AccountSettingsContext = React.createContext<AccountSettings>(
  DEFAULT_ACCOUNT_SETTINGS
);

export const AccountSettingsContextProvider: React.FC = function ({
  children,
}) {
  const [{ data, error }] = useLoadAccountSettingsQuery();

  // If the query fails, log the error to Sentry and return an empty list of settings
  if (error) captureException(error);

  const settings: AccountSettings = Object.assign(
    {},
    DEFAULT_ACCOUNT_SETTINGS,
    data?.currentAccount,
    {
      sitePermissions: new Set(data?.currentAccount?.sitePermissions ?? []),
      enabledFeatures: new Set(data?.currentAccount?.enabledFeatures ?? []),
    }
  );

  return (
    <AccountSettingsContext.Provider value={settings}>
      {children}
    </AccountSettingsContext.Provider>
  );
};

export function useAccountSettings(): AccountSettings {
  return useContext(AccountSettingsContext);
}

export function useFeatureFlag(feature: string): boolean {
  const { enabledFeatures } = useAccountSettings();

  return enabledFeatures.has(feature);
}

export function useSitePermission(permission: string): boolean {
  const { sitePermissions } = useAccountSettings();

  return sitePermissions.has(permission);
}
