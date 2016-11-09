import { helper } from 'ember-helper';
import jQuery from 'jquery';

export function isObject([object]) {
  return jQuery.isPlainObject(object);
}

export default helper(isObject);
