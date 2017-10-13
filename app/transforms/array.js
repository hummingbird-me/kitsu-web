import { isArray } from '@ember/array';
import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(value) {
    return isArray(value) ? value : [];
  },

  serialize(value) {
    return this.deserialize(value);
  }
});
