import { captureException } from '@sentry/react';
import React, { createContext, useContext } from 'react';

import { ImageFragment } from '@/components/content/Image';
import { graphql, useQuery, type ResultOf } from '@/graphql';

const LoadAccountQuery = graphql(
  `
    query loadAccount {
      currentAccount {
        id
        profile {
          id
          slug
          name
          avatarImage {
            ...ImageFragment
          }
          bannerImage {
            ...ImageFragment
          }
        }
        country
        language
        ratingSystem
        sfwFilter
        sitePermissions
        timeZone
        enabledFeatures
      }
    }
  `,
  [ImageFragment],
);

export type Account = {
  fetching: boolean;
  id?: string;
  country?: string;
  language?: string;
  ratingSystem: string;
  sfwFilter: boolean;
  sitePermissions: Set<string>;
  timeZone?: string;
  enabledFeatures: Set<string>;
  profile?: {
    id: string;
    slug?: string;
    name: string;
    avatarImage?: ResultOf<typeof ImageFragment>;
    bannerImage?: ResultOf<typeof ImageFragment>;
  };
};

const DEFAULTS: Account = {
  fetching: true,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  ratingSystem: 'SIMPLE',
  sfwFilter: true,
  sitePermissions: new Set(),
  enabledFeatures: new Set(),
};

export const AccountContext = createContext<Account>(DEFAULTS);

export function AccountContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ data, error, fetching }] = useQuery({
    query: LoadAccountQuery,
    requestPolicy: 'cache-and-network',
    suspense: false,
  });

  // If the query fails, log the error to Sentry and return an empty list of settings
  if (error) captureException(error);

  const account: Account = Object.assign(
    {},
    DEFAULTS,
    data?.currentAccount,
    {
      sitePermissions: new Set(data?.currentAccount?.sitePermissions ?? []),
      enabledFeatures: new Set(data?.currentAccount?.enabledFeatures ?? []),
    },
    { fetching },
  );

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
}

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
