import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  description: attr('string'),
  // TODO: Replace with default image for characters
  image: attr('object', { defaultValue: '/image/default_avatar.png' }),
  malId: attr('number'),
  name: attr('string'),
  slug: attr('string'),

  primaryMedia: belongsTo('media')
});
