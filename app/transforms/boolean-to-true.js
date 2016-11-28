import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return (serialized === null || serialized === undefined) ? true : serialized;
  },

  serialize(deserialized) {
    return deserialized;
  }
});
