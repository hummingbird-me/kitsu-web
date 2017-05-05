import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  foreignId: attr('string'),
  mentionedUsers: attr('array'),
  nineteenScale: attr('boolean'),
  postId: attr('number'),
  progress: attr('number'),
  rating: attr('rating'),
  replyToType: attr('string'),
  replyToUser: attr('string'),
  status: attr('string'),
  streamId: attr('string'),
  time: attr('utc'),
  verb: attr('string'),

  actor: belongsTo('user'),
  media: belongsTo('media'),
  subject: belongsTo('-base'),
  target: belongsTo('-base'),
  unit: belongsTo('-base')
});
