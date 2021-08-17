import { Observable, ApolloLink, Operation } from '@apollo/client';

import { Session } from 'app/types/session';
import loginWithRefreshToken from 'app/utils/login/withRefreshToken';

function setAuthorizationContext(operation: Operation, session: Session) {
  if (session?.loggedIn) {
    const context = operation.getContext();
    operation.setContext({
      ...context,
      headers: {
        ...context.headers,
        Authorization: session ? `Bearer ${session.accessToken}` : '',
      },
    });
  }
}

export default ({
  session,
  setSession,
  clearSession,
}: {
  session: Session;
  setSession: (session: Session) => void;
  clearSession: () => void;
}): ApolloLink => {
  return new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      // If we're logged in, set the Authorization header
      setAuthorizationContext(operation, session);
      forward(operation).subscribe({
        next: (value) => observer.next(value),
        error: (networkError) => {
          if (networkError.statusCode === 401 && session) {
            loginWithRefreshToken(session.refreshToken).then(
              (newSession) => {
                // Save the session
                setSession(newSession);
                // Add the header
                setAuthorizationContext(operation, newSession);
                // Try again
                forward(operation).subscribe({
                  next: (value) => observer.next(value),
                  error: (networkError) => {
                    if (networkError.statusCode === 401) {
                      clearSession();
                    } else {
                      observer.error(networkError);
                    }
                  },
                  complete: () => observer.complete(),
                });
              },
              (error) => {
                clearSession();
                observer.error(error);
              }
            );
          } else {
            console.error(networkError);
            observer.error(networkError);
          }
        },
        complete: () => observer.complete(),
      });
    });
  });
};
