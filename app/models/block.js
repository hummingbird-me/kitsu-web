import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  blocked: belongsTo('user'),
  user: belongsTo('user', { inverse: 'blocks' })
});
