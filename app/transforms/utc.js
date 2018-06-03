import Transform from 'ember-data/transform';
import moment from 'moment';

export default Transform.extend({
  serialize(value) {
    if (value) {
      return value.toJSON();
    }
    return null;
  },

  deserialize(value) {
    if (value) {
      return moment.utc(value);
    }
    return null;
  }
});
