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

export default {
  fork
};
