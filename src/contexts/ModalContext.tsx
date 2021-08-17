import React from 'react';

export const IsModalContext = React.createContext<boolean>(false);

export const IsModalContextProvider: React.FC = function ({ children }) {
  return (
    <IsModalContext.Provider value={true}>{children}</IsModalContext.Provider>
  );
};
