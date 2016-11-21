import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  review: belongsTo('review'),
  user: belongsTo('user')
});
