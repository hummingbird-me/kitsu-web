import { differenceInSeconds } from 'date-fns';

import { Session } from 'app/types/session';

/*
 * For now, we maintain compatibility with Ember Simple Auth so we can coexist with the
 * existing Ember app.
 */
type EmberSimpleAuthSession = {
  authenticated: {
    access_token: string;
    authenticator: 'authenticator:oauth2';
    created_at: number;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: 'Bearer';
  };
};

export function save(session: Session): void {
  if (!session) return;

  const emberSession: EmberSimpleAuthSession = {
    authenticated: {
      access_token: session.accessToken,
      authenticator: 'authenticator:oauth2',
      created_at: Math.floor(Date.now() / 1000),
      expires_at: session.expiresAt.getTime(),
      expires_in: differenceInSeconds(Date.now(), session.expiresAt),
      refresh_token: session.refreshToken,
      scope: 'public',
      token_type: 'Bearer',
    },
  };

  localStorage.setItem(
    'ember_simple_auth:session',
    JSON.stringify(emberSession)
  );
}

export function clear(): void {
  localStorage.removeItem('ember_simple_auth:session');
}

export function load(): Session {
  const rawEmberSession = localStorage.getItem('ember_simple_auth:session');
  if (!rawEmberSession) return null;
  const emberSession: EmberSimpleAuthSession = JSON.parse(rawEmberSession);

  return {
    loggedIn: true,
    accessToken: emberSession.authenticated.access_token,
    refreshToken: emberSession.authenticated.refresh_token,
    expiresAt: new Date(emberSession.authenticated.expires_at),
  };
}
