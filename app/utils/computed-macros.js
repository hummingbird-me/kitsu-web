import computed from 'ember-computed';
import get from 'ember-metal/get';

/**
 * Concat an array target onto an array source
 *
 * @param {*} deps
 */
export function concat(...deps) {
  const depKeys = deps.map(dep => `${dep}.[]`);
  return computed(...depKeys, function() {
    const array = deps.map(dep => (get(this, dep) || []).slice());
    return [].concat(...array);
  }).readOnly();
}

export default {
  concat
};
