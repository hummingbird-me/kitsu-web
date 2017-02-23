import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Base.extend({
  rank: attr('string'),

  group: belongsTo('group'),
  user: belongsTo('user'),

  permissions: hasMany('group-permission', { inverse: 'groupMember' })
});
