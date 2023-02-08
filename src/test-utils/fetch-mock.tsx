import fetchMock from 'fetch-mock';
import { afterEach } from 'vitest';

afterEach(() => {
  fetchMock.reset();
});

export default fetchMock;
