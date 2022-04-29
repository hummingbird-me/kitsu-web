import { afterEach } from 'vitest';
import fetchMock from 'fetch-mock';

afterEach(() => {
  fetchMock.reset();
});

export default fetchMock;
