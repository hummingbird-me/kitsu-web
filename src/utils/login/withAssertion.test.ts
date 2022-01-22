import { afterEach, vi, describe, test, expect } from 'vitest';
import fetchMock from 'fetch-mock';
afterEach(() => fetchMock.reset());
vi.mock('app/constants/config');

import { LoginFailed, NetworkError } from 'app/errors';

import loginWithAssertion from './withAssertion';
describe('loginWithAssertion', () => {
  test('with successful response', async () => {
    fetchMock.post('https://kitsu.io/api/oauth/token', {
      status: 200,
      body: {
        access_token: 'TOKEN',
        token_type: 'Bearer',
        expires_in: 30 * 24 * 60 * 60,
        refresh_token: 'REFRESH-TOKEN',
        scope: 'public',
        created_at: Date.now() / 1000,
      },
    });
    const session = await loginWithAssertion({
      token: 'FACEBOOK-TOKEN',
      provider: 'facebook',
    });
    expect(session).not.toBeNull();
    expect(session?.accessToken).toBe('TOKEN');
    expect(session?.refreshToken).toBe('REFRESH-TOKEN');
  });

  test('with failed response', async () => {
    fetchMock.post('https://kitsu.io/api/oauth/token', {
      status: 401,
      body: {
        error: 'invalid_grant',
        error_description: 'Login failed',
      },
    });

    await expect(
      loginWithAssertion({
        token: 'FACEBOOK-TOKEN',
        provider: 'facebook',
      })
    ).rejects.toThrow(LoginFailed);
  });

  test('with a network error', async () => {
    fetchMock.post('https://kitsu.io/api/oauth/token', {
      throws: new TypeError('Network Error'),
    });

    await expect(
      loginWithAssertion({
        token: 'FACEBOOK-TOKEN',
        provider: 'facebook',
      })
    ).rejects.toThrow(NetworkError);
  });
});
