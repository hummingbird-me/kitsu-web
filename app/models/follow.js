import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  follower: belongsTo('user'),
  followed: belongsTo('user')
});
