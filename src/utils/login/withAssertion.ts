import { Session } from 'app/types/session';
import login from './login';

export default async function loginWithAssertion(
  { token, provider }: { token: string; provider: 'apple' | 'facebook' },
  init: RequestInit = {}
): Promise<NonNullable<Session>> {
  return login({
    params: {
      grant_type: 'assertion',
      assertion: token,
      provider,
    },
    init,
  });
}
