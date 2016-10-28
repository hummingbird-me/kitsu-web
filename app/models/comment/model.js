import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  blocked: attr('boolean'),
  content: attr('string'),
  contentFormatted: attr('string'),
  createdAt: attr('date', { defaultValue() { return new Date(); } }),
  deletedAt: attr('date'),

  user: belongsTo('user'),
  post: belongsTo('post', { inverse: 'comments' })
});
