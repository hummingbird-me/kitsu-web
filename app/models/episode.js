import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Base.extend({
  airdate: attr('utc'),
  canonicalTitle: attr('string'),
  length: attr('number'),
  number: attr('number'),
  seasonNumber: attr('number'),
  synopsis: attr('string'),
  thumbnail: attr('object'),
  titles: attr('object'),

  media: belongsTo('media'),

  computedTitle: computed('number', 'canonicalTitle', function() {
    const number = get(this, 'number');
    const title = get(this, 'canonicalTitle');
    return `${number}: ${title}`;
  }).readOnly(),
});
