import { helper } from '@ember/component/helper';
import { isArray } from '@ember/array';

/**
 * Supports calling `toLowerCase` on a single property, or on each
 * property in an array.
 */
export function toLower([target = '']) {
  if (isArray(target)) {
    return target.slice().map(x => x.toLowerCase());
  }
  return target.toLowerCase();
}

export default helper(toLower);
