import React, { useContext } from 'react';

import { useLoadFeatureFlagsQuery } from './loadFeatureFlags-gql';

type FeatureFlags = Set<string>;

export const FeatureFlagsContext = React.createContext<FeatureFlags>(new Set());

export const FeatureFlagsContextProvider: React.FC = function ({ children }) {
  const { data, loading, error } = useLoadFeatureFlagsQuery();

  if (error) throw error;

  if (!loading && data?.currentAccount?.enabledFeatures) {
    const featureFlags = new Set(data.currentAccount.enabledFeatures);

    return (
      <FeatureFlagsContext.Provider value={featureFlags}>
        {children}
      </FeatureFlagsContext.Provider>
    );
  } else {
    return (
      <FeatureFlagsContext.Provider value={new Set()}>
        {children}
      </FeatureFlagsContext.Provider>
    );
  }
};

export function useFeatureFlag(feature: string): boolean {
  const featureFlags = useContext(FeatureFlagsContext);

  return featureFlags.has(feature);
}
