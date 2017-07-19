import Base from 'client/models/-base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  mediaReaction: belongsTo('media-reaction'),
  user: belongsTo('user')
});
