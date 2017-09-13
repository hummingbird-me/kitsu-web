import UploadOwner from 'client/models/upload-owner';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default UploadOwner.extend({
  blocked: attr('boolean'),
  content: attr('string'),
  contentFormatted: attr('string'),
  createdAt: attr('utc', { defaultValue() { return new Date(); } }),
  editedAt: attr('utc'),
  likesCount: attr('number'),
  repliesCount: attr('number'),
  updatedAt: attr('utc'),

  parent: belongsTo('comment', { inverse: 'replies' }),
  post: belongsTo('post', { inverse: 'comments' }),
  user: belongsTo('user'),

  likes: hasMany('comment-like'),
  replies: hasMany('comment', { inverse: 'parent' })
});
