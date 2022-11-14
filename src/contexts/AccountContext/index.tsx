import { captureException } from '@sentry/react';
import React, { useContext } from 'react';

import { RatingSystemEnum } from 'app/graphql/types';

import { LoadAccountQuery, useLoadAccountQuery } from './loadAccount-gql';

// Mangle our
export type Account = {
  id?: string;
  profile?: NonNullable<LoadAccountQuery['currentAccount']>['profile'];
  // These are guaranteed by our defaults below
  timeZone: string;
  ratingSystem: RatingSystemEnum;
  sfwFilter: boolean;
  sitePermissions: Set<string>;
  enabledFeatures: Set<string>;
};

const DEFAULTS: Account = {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  ratingSystem: RatingSystemEnum.Simple,
  sfwFilter: true,
  sitePermissions: new Set(),
  enabledFeatures: new Set(),
};

export const AccountContext = React.createContext<Account>(DEFAULTS);

export const AccountContextProvider: React.FC = function ({ children }) {
  const [{ data, error }] = useLoadAccountQuery({
    requestPolicy: 'cache-and-network',
  });

  // If the query fails, log the error to Sentry and return an empty list of settings
  if (error) captureException(error);

  const account: Account = Object.assign({}, DEFAULTS, data?.currentAccount, {
    sitePermissions: new Set(data?.currentAccount?.sitePermissions ?? []),
    enabledFeatures: new Set(data?.currentAccount?.enabledFeatures ?? []),
  });

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount(): Account {
  return useContext(AccountContext);
}

export function useFeatureFlag(feature: string): boolean {
  const { enabledFeatures } = useAccount();

  return enabledFeatures.has(feature);
}

export function useSitePermission(permission: string): boolean {
  const { sitePermissions } = useAccount();

  return sitePermissions.has(permission);
}
