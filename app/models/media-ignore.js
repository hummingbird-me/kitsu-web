import Base from 'client/models/-base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  media: belongsTo('media'),
  user: belongsTo('user'),
});
