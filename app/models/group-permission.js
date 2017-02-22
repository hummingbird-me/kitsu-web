import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  permission: attr('string'),

  groupMember: belongsTo('group-member', { inverse: 'permissions' }),
});
