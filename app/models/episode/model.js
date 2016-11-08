import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  airdate: attr('date'),
  canonicalTitle: attr('string'),
  length: attr('number'),
  number: attr('number'),
  seasonNumber: attr('number'),
  synopsis: attr('string'),
  titles: attr('object'),

  media: belongsTo('media'),
});
