import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  review: belongsTo('review'),
  user: belongsTo('user')
});
