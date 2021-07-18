import { Session } from 'app/types/session';
import login from './login';

export default async function loginWithPassword(
  { username, password }: { username: string; password: string },
  init: RequestInit = {}
): Promise<NonNullable<Session>> {
  return login({
    params: {
      grant_type: 'password',
      username,
      password: encodeURIComponent(password),
    },
    init,
  });
}
