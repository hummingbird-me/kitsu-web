import computed from 'ember-computed';
import get from 'ember-metal/get';
import { typeOf } from 'ember-utils';

/**
 * Concat an array target onto an array source
 *
 * @param {*} deps
 */
export function concat(...dependents) {
  const dependentKeys = dependents.map(dep => `${dep}.[]`);
  return computed(...dependentKeys, function() {
    const array = dependents.map((dep) => {
      const value = get(this, dep);
      if (value && typeOf(value) === 'array') {
        return value.slice();
      } else if (value && typeOf(value.toArray) === 'function') {
        return value.toArray().slice();
      }
      return [];
    });
    const flattened = array.reduce((prev, curr) => prev.concat(curr), []);
    return [].addObjects(flattened);
  }).readOnly();
}

export default {
  concat
};
