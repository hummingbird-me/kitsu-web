import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

/**
 * Depends on a property and updates a second property. This allows us to
 * deviate from the original value, but also reset the state when it is.
 *
 * @export
 * @param {String} key
 * @returns {any}
 */
export function fork(property, key) {
  return computed(key, {
    get() {
      return set(this, property, get(this, key));
    },

    set(_, value) {
      return set(this, property, value);
    }
  });
}

/**
 * Concat an array target onto an array source
 *
 * @export
 * @param {any} source
 * @param {any} target
 * @returns
 */
export function concat(source, target) {
  return computed(`${source}.[]`, `${target}.[]`, function() {
    return (get(this, source) || []).slice().concat((get(this, target) || []).slice());
  }).readOnly();
}

export default {
  fork,
  concat
};
