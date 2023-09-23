import { authExchange } from '@urql/exchange-auth';
import { Exchange } from 'urql';

import { LoginFailed } from 'app/errors';
import { Session } from 'app/types/session';
import loginWithRefreshToken from 'app/utils/login/withRefreshToken';

export default function kitsuAuthExchange({
  session,
  setSession,
  clearSession,
}: {
  session: Session;
  setSession: (session: Session) => void;
  clearSession: () => void;
}): Exchange {
  return authExchange(async utils => ({
    addAuthToOperation(operation) {
      if (!session?.accessToken) return operation;

      return utils.appendHeaders(operation, {
        Authorization: `Bearer ${session.accessToken}`,
      })
    },
    didAuthError(errors) {
      return errors.response.status === 401;
    },
    async refreshAuth() {
      if (session?.refreshToken) {
        try {
          const newSession = await loginWithRefreshToken(session.refreshToken);
          setSession(newSession);
        } catch (e) {
          if (e instanceof LoginFailed) {
            clearSession();
          }
        }
      } else {
        clearSession();
      }
    },
  }));
}
