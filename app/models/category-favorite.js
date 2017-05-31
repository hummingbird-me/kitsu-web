import Base from 'client/models/-base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  user: belongsTo('user'),
  category: belongsTo('category')
});
