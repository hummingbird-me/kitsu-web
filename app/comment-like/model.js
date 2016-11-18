import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  comment: belongsTo('comment', { inverse: 'likes' }),
  user: belongsTo('user')
});
