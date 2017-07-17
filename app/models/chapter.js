import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Base from 'client/models/-base';

export default Base.extend({
  titles: attr('object'),
  canonicalTitle: attr('string'),
  volumeNumber: attr('number'),
  number: attr('number'),
  synopsis: attr('string'),
  published: attr('boolean'),
  length: attr('number'),
  thumbnail: attr('object'),

  manga: belongsTo('manga')
});
