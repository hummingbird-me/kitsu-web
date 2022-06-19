import { Session } from 'app/types/session';
import login from './login';
import LoginFailed from 'app/errors/LoginFailed';

export default async function loginWithPassword(
  { username, password }: { username?: string; password?: string },
  init: RequestInit = {}
): Promise<NonNullable<Session>> {
  if (!username || !password) throw LoginFailed;

  return login({
    params: {
      grant_type: 'password',
      username,
      password,
    },
    init,
  });
}
