import React from 'react';

import Header from 'app/components/QUEmbed/Header';

const Layout: React.FC = function ({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
