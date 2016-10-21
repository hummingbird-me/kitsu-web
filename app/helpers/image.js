import { helper } from 'ember-helper';
import get from 'ember-metal/get';
import jQuery from 'jquery';

export function image([object, size = 'original']) {
  if (jQuery.isPlainObject(object) === true) {
    return get(object, size);
  }
  return object;
}

export default helper(image);
