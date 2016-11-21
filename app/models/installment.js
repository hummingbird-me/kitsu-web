import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  position: attr('number'),
  tag: attr('string'),

  franchise: belongsTo('franchise', { inverse: 'installments' }),
  media: belongsTo('media'),
});
