import { helper } from 'ember-helper';
import { typeOf } from 'ember-utils';

export function isObject([object]) {
  return typeOf(object) === 'object';
}

export default helper(isObject);
