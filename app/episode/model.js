import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  airdate: attr('utc'),
  canonicalTitle: attr('string'),
  length: attr('number'),
  number: attr('number'),
  seasonNumber: attr('number'),
  synopsis: attr('string'),
  // TODO: We need a empty image for missing episodes
  thumbnail: attr('object', { defaultValue: 'images/default_poster.jpg' }),
  titles: attr('object'),

  media: belongsTo('media'),
});
