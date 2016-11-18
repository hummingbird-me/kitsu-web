import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  media: belongsTo('media'),
  user: belongsTo('user'),
});
