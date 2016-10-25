import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  blocked: attr('boolean'),
  commentsCount: attr('number'),
  content: attr('string'),
  contentFormatted: attr('string'),
  createdAt: attr('date'),
  deletedAt: attr('date'),
  nsfw: attr('boolean'),
  postLikesCount: attr('number'),
  spoiler: attr('boolean'),

  media: belongsTo('media'),
  spoiledUnit: belongsTo('base'),
  targetUser: belongsTo('user'),
  user: belongsTo('user'),

  comments: hasMany('comment', { inverse: 'post' }),
  postLikes: hasMany('post-like', { inverse: 'post' })
});
