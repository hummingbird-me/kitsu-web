import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  comment: belongsTo('comment', { inverse: 'likes' }),
  user: belongsTo('user')
});
