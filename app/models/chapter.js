import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Base from 'client/models/-base';

export default Base.extend({
  published: attr('utc'),
  canonicalTitle: attr('string'),
  length: attr('number'),
  number: attr('number'),
  volumeNumber: attr('number'),
  synopsis: attr('string'),
  thumbnail: attr('object'),
  titles: attr('object'),

  manga: belongsTo('manga', { inverse: 'chapters' })
});
