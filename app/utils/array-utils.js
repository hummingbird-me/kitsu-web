import get from 'ember-metal/get';
import set from 'ember-metal/set';

// eslint-disable-next-line import/prefer-default-export
export function createArrayWithLinks(data) {
  const res = data.toArray();
  set(res, 'links', get(data, 'links'));
  return res;
}
