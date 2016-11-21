import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  user: belongsTo('user'),
  post: belongsTo('post', { inverse: 'postLikes' })
});
