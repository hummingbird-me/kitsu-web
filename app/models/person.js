import attr from 'ember-data/attr';
import Base from 'client/models/-base';
import { hasMany } from 'ember-data/relationships';

export default Base.extend({
  // TODO: Replace with default image for characters
  image: attr('object', { defaultValue: '/image/default_avatar.png' }),
  name: attr('string'),

  castings: hasMany('casting')
});
