import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  // TODO: Replace with default image for characters
  image: attr('object', { defaultValue: '/image/default_avatar.png' }),
  name: attr('string'),

  castings: hasMany('casting')
});
