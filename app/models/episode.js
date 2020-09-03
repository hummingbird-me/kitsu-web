import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  airdate: attr('utc'),
  canonicalTitle: attr('string'),
  length: attr('number'),
  number: attr('number'),
  seasonNumber: attr('number'),
  description: attr('string'),
  thumbnail: attr('object'),
  titles: attr('object'),

  media: belongsTo('media', { inverse: 'episodes' }),
});
