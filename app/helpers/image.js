import { helper } from 'ember-helper';
import get from 'ember-metal/get';
import jQuery from 'jquery';

export function image([object, size]) {
  if (jQuery.isPlainObject(object) === true) {
    size = size || 'original';
    return get(object, size);
  }
  return object;
}

export default helper(image);
