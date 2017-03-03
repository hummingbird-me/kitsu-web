import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  content: attr('string'),
  contentFormatted: attr('string'),
  createdAt: attr('utc'),
  kind: attr('string'),

  ticket: belongsTo('group-ticket', { inverse: 'messages' }),
  user: belongsTo('user')
});
