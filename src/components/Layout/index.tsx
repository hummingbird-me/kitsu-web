import React, { useContext } from 'react';

import { LayoutSettingsContext } from 'app/contexts/LayoutSettingsContext';
import Header from 'app/components/Header';

const Layout: React.FC = function ({ children }) {
  const { layoutSettings } = useContext(LayoutSettingsContext);

  return (
    <>
      <Header {...layoutSettings.header} />
      {children}
    </>
  );
};

export default Layout;
