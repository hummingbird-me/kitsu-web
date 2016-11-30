import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  reason: attr('string'),
  status: attr('string'),
  explanation: attr('string'),

  naughty: belongsTo('base'),
  moderator: belongsTo('user'),
  user: belongsTo('user')
});
