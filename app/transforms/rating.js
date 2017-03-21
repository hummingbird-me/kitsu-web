import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(value) {
    return value / 2;
  },

  serialize(value) {
    return value * 2;
  }
});
