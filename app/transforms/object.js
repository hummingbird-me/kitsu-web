import jQuery from 'jquery';
import Transform from 'ember-data/transform';
import { isEmpty } from 'ember-utils';

export default Transform.extend({
  deserialize(value, options) {
    if (value === null && options !== undefined && options.defaultValue !== undefined) {
      return options.defaultValue;
    }
    return jQuery.isPlainObject(value) ? value : {};
  },

  serialize(value) {
    return isEmpty(value) ? {} : value;
  }
});
