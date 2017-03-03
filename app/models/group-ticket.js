import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Base.extend({
  createdAt: attr('utc'),
  status: attr('string'),
  title: attr('string'),

  assignee: belongsTo('user'),
  group: belongsTo('group'),
  user: belongsTo('user'),

  messages: hasMany('group-ticket-message', { inverse: 'ticket' })
});
