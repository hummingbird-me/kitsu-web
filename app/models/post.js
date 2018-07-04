import UploadOwner from 'client/models/-upload-owner';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default UploadOwner.extend({
  blocked: attr('boolean'),
  commentsCount: attr('number'),
  content: attr('string'),
  contentFormatted: attr('string'),
  createdAt: attr('utc', { defaultValue() { return new Date(); } }),
  editedAt: attr('utc'),
  embed: attr('object'),
  embedUrl: attr('string'),
  nsfw: attr('boolean'),
  postLikesCount: attr('number'),
  spoiler: attr('boolean'),
  targetInterest: attr('string'),
  topLevelCommentsCount: attr('number'),
  updatedAt: attr('utc', { defaultValue() { return new Date(); } }),

  media: belongsTo('media', { async: false }),
  spoiledUnit: belongsTo('-base', { async: false }),
  targetGroup: belongsTo('group', { async: false }),
  targetUser: belongsTo('user', { async: false }),
  user: belongsTo('user', { async: false }),

  comments: hasMany('comment', { inverse: 'post' }),
  postLikes: hasMany('post-like', { inverse: 'post' })
});
