import { memoize } from 'lodash-es';
import React, { createContext, useContext, useState } from 'react';

import InvariantViolated from '@/errors/InvariantViolated';
import loginWithRefreshToken from '@/utils/login/withRefreshToken';
import {
  clear as _clearSession,
  load as _loadSession,
  save as _saveSession,
  type LoggedInSession,
  type Session,
} from '@/utils/session';

export type SessionContextType = {
  session: Session;
  setSession: (newSession: LoggedInSession) => void;
  clearSession: () => void;
};

// Null only occurs before the component is loaded (it should never occur)
export const SessionContext = createContext<SessionContextType | null>(null);

export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, _setSession] = useState<Session>(_loadSession());

  const setSession = (newSession: LoggedInSession) => {
    _setSession(newSession);
    _saveSession(newSession);
  };
  const clearSession = () => {
    _setSession({ loggedIn: false });
    _clearSession();
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
}

/**
 * Get the current session from the context.
 *
 * @returns The current session object
 */
export const useSession = function () {
  const context = useContext(SessionContext);
  if (!context) throw new InvariantViolated('Session context missing');
  return context.session;
};

/**
 * Get the raw session context object with setSession and clearSession functions.
 *
 * @returns The raw session context object
 */
export const useRawSession = function () {
  const context = useContext(SessionContext);
  if (!context) throw new InvariantViolated('Session context missing');
  return context;
};

/**
 * Refresh the session by exchanging the refreshToken for a new accessToken.
 *
 * Note that this function is memoized to prevent multiple calls using the same refreshToken, with
 * repeated calls returning the same promise.
 *
 * @param session The current session context object
 */
export const refreshSession = memoize(
  async function ({
    session,
    setSession,
  }: SessionContextType): Promise<Session> {
    if (!session.loggedIn) return session;

    const newSession = await loginWithRefreshToken(session.refreshToken);

    setSession(newSession);

    return newSession;
  },
  ({ session }) => (session.loggedIn ? session.refreshToken : null),
);
