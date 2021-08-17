import React, { useState, useContext } from 'react';

import { Session } from 'app/types/session';
import * as SessionStore from 'app/utils/session-store';

export const SessionContext = React.createContext<{
  session: Session;
  setSession: (newSession: Session) => void;
  clearSession: () => void;
}>({
  session: null,
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  setSession: () => {},
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  clearSession: () => {},
});

export const SessionContextProvider: React.FC = function ({ children }) {
  const [session, _setSession] = useState<Session>(SessionStore.load);

  const setSession = (newSession: Session) => {
    _setSession(newSession);
    SessionStore.save(newSession);
  };
  const clearSession = () => {
    _setSession(null);
    SessionStore.clear();
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        clearSession,
      }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = function () {
  return useContext(SessionContext);
};
