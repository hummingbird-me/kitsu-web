import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Base.extend({
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

  likes: hasMany('comment-like', { inverse: 'comment' }),
  replies: hasMany('comment', { inverse: 'parent' })
});
