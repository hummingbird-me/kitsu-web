import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  content: attr('string'),
  contentFormatted: attr('string'),
  legacy: attr('boolean'),
  likesCount: attr('number'),
  progress: attr('number'),
  rating: attr('number'),
  source: attr('string'),
  summary: attr('string'),

  libraryEntry: belongsTo('library-entry'),
  media: belongsTo('media'),
  user: belongsTo('user')
});
