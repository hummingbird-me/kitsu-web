import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  blocked: belongsTo('user'),
  user: belongsTo('user', { inverse: 'blocks' })
});
