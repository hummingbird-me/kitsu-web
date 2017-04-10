import computed from 'ember-computed';
import get from 'ember-metal/get';

/**
 * Concat an array target onto an array source
 *
 * @param {*} deps
 */
export function concat(...dependents) {
  const dependentKeys = dependents.map(dep => `${dep}.[]`);
  return computed(...dependentKeys, function() {
    const array = dependents.map(dep => (get(this, dep) || []).slice());
    const flattened = array.reduce((prev, curr) => prev.concat(curr));
    return [].addObjects(flattened);
  }).readOnly();
}

export default {
  concat
};
