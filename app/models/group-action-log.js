import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  verb: attr('string'),

  group: belongsTo('group', { inverse: 'actionLogs' }),
  user: belongsTo('user'),
  target: belongsTo('-base')
});
