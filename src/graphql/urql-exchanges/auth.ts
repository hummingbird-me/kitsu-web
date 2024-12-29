import { type SessionContextType } from '@/contexts/SessionContext';
import loginWithRefreshToken from '@/utils/login/withRefreshToken';
import * as Sentry from '@sentry/react';
import { authExchange } from '@urql/exchange-auth';
import { type Exchange } from 'urql';

export default function kitsuAuthExchange({
  session,
  setSession,
  clearSession,
}: SessionContextType): Exchange {
  return authExchange(async (utils) => ({
    addAuthToOperation(operation) {
      if (!session.loggedIn) return operation;
      const accessToken = session.accessToken;

      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${accessToken}`,
      });
    },
    didAuthError(errors) {
      return errors.response.status === 401;
    },
    async refreshAuth() {
      if (!session.loggedIn) return;

      try {
        setSession(await loginWithRefreshToken(session.refreshToken));
      } catch (e) {
        Sentry.captureException(e);
        clearSession();
      }
    },
  }));
}
