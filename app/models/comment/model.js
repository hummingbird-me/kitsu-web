import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  blocked: attr('boolean'),
  content: attr('string'),
  contentFormatted: attr('string'),
  createdAt: attr('date', { defaultValue() { return new Date(); } }),
  deletedAt: attr('date'),
  likesCount: attr('number'),

  parent: belongsTo('comment', { inverse: 'replies' }),
  post: belongsTo('post', { inverse: 'comments' }),
  user: belongsTo('user'),

  likes: hasMany('comment-like', { inverse: 'comment' }),
  replies: hasMany('comment', { inverse: 'parent' })
});
