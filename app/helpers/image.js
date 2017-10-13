import Helper from '@ember/component/helper';
import { get, set, observer } from '@ember/object';
import jQuery from 'jquery';

export function image(object, size = 'original') {
  if (jQuery.isPlainObject(object) === true) {
    return get(object, size);
  }
  return object;
}

export default Helper.extend({
  compute([object, size = 'original']) {
    set(this, 'object', object);
    set(this, 'size', size);

    return image(object, size);
  },

  _imageChanged: observer('object', 'size', function() {
    this.recompute();
  })
});
