import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  hidden: attr('boolean'),

  follower: belongsTo('user'),
  followed: belongsTo('user')
});
