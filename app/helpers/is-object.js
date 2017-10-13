import { helper } from '@ember/component/helper';
import { typeOf } from '@ember/utils';

export function isObject([object]) {
  return typeOf(object) === 'object';
}

export default helper(isObject);
