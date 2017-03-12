import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  createdAt: attr('utc'),

  group: belongsTo('group'),
  moderator: belongsTo('user'),
  user: belongsTo('user')
});
