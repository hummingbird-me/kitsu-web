import computed from 'ember-computed';
import get from 'ember-metal/get';

/**
 * Concatenates the target array's objects onto the source array.
 *
 * @export
 * @param {any[]} source
 * @param {any[]} target
 * @returns {any[]}
 */
export function concat(source, target) {
  return computed(`${source}.[]`, `${target}.[]`, function() {
    return (get(this, source) || []).slice().addObjects((get(this, target) || []).slice());
  }).readOnly();
}

export default {
  concat
};
