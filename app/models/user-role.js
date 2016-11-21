import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  role: belongsTo('role'),
  user: belongsTo('user')
});
