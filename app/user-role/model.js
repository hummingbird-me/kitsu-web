import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  role: belongsTo('role'),
  user: belongsTo('user')
});
