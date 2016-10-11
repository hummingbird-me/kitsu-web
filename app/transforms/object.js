import jQuery from 'jquery';
import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(value, options) {
    if (value === null && options !== undefined && options.defaultValue !== undefined) {
      return options.defaultValue;
    }
    return jQuery.isPlainObject(value) ? value : {};
  },

  serialize(value) {
    return this.deserialize(value);
  }
});
