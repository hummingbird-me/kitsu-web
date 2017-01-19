import attr from 'ember-data/attr';
import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  content: attr('string'),
  contentFormatted: attr('string'),
  likesCount: attr('number'),
  progress: attr('number'),
  rating: attr('number'),
  spoiler: attr('boolean'),

  libraryEntry: belongsTo('library-entry'),
  media: belongsTo('media'),
  user: belongsTo('user')
});
