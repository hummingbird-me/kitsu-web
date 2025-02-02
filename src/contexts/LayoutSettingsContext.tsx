import { isEqual, merge } from 'lodash-es';
import React, { useContext, useEffect, useState } from 'react';
import { type PartialDeep } from 'type-fest';

import { type HeaderProps } from '@/components/Header/Header';

type LayoutSettings = {
  header: HeaderProps;
};

const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  header: {},
};

type LayoutSettingsContextType = {
  layoutSettings: LayoutSettings;
  setLayoutSettings: (newLayoutSettings: LayoutSettings) => void;
};

export const LayoutSettingsContext =
  React.createContext<LayoutSettingsContextType>({
    layoutSettings: DEFAULT_LAYOUT_SETTINGS,

    setLayoutSettings: () => {},
  });

export const LayoutSettingsContextProvider: React.FC = function ({ children }) {
  const [layoutSettings, setLayoutSettings] = useState(DEFAULT_LAYOUT_SETTINGS);

  return (
    <LayoutSettingsContext.Provider
      value={{
        layoutSettings,
        setLayoutSettings,
      }}>
      {children}
    </LayoutSettingsContext.Provider>
  );
};

export const setLayoutSettings = function (
  settings: PartialDeep<LayoutSettings>,
): void {
  const { layoutSettings, setLayoutSettings } = useContext(
    LayoutSettingsContext,
  );

  // Ensure the settings are actually being changed before updating
  const mergedLayoutSettings = merge(
    {},
    DEFAULT_LAYOUT_SETTINGS,
    layoutSettings,
    settings,
  );
  if (!isEqual(layoutSettings, mergedLayoutSettings)) {
    useEffect(() => {
      return setLayoutSettings(mergedLayoutSettings);
    }, [mergedLayoutSettings]);
  }
};

export const HeaderSettings: React.FC<HeaderProps> = function ({
  background,
  scrollBackground,
}) {
  setLayoutSettings({ header: { background, scrollBackground } });

  return <></>;
};
