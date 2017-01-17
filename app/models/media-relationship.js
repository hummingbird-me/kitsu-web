import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  role: attr('string'),

  source: belongsTo('media'),
  destination: belongsTo('media')
});
