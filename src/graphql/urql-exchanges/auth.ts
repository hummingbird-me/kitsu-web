import { Operation, Exchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';

import { Session } from 'app/types/session';
import loginWithRefreshToken from 'app/utils/login/withRefreshToken';
import { LoginFailed } from 'app/errors';

function addAuthToOperation({
  authState,
  operation,
}: {
  authState: Session;
  operation: Operation;
}) {
  if (!authState || !authState.accessToken) return operation;

  // fetchOptions can be a function (See Client API) but you can simplify this based on usage
  const fetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return {
    ...operation,
    context: {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${authState.accessToken}`,
        },
      },
    },
  };
}

export default function kitsuAuthExchange({
  session,
  setSession,
  clearSession,
}: {
  session: Session;
  setSession: (session: Session) => void;
  clearSession: () => void;
}): Exchange {
  return authExchange<Session>({
    addAuthToOperation,
    didAuthError({ error }) {
      return error.response.status === 401;
    },
    async getAuth({ authState }) {
      if (!authState) return session;

      if (authState?.refreshToken) {
        try {
          const newSession = await loginWithRefreshToken(
            authState.refreshToken
          );
          setSession(newSession);
          return newSession;
        } catch (e) {
          if (e instanceof LoginFailed) {
            setSession(null);
          }
          return null;
        }
      } else {
        clearSession();
        return null;
      }
    },
  });
}
