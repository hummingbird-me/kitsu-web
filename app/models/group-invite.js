import Base from 'client/models/-base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  group: belongsTo('group'),
  sender: belongsTo('user'),
  user: belongsTo('user')
});
