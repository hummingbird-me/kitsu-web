import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { alias } from '@ember/object/computed';

export default Base.extend({
  content: attr('string'),
  contentFormatted: attr('string'),
  likesCount: attr('number'),
  progress: attr('number'),
  rating: attr('rating'),
  spoiler: attr('boolean'),

  libraryEntry: belongsTo('library-entry', { inverse: 'review' }),
  media: belongsTo('media'),
  user: belongsTo('user'),

  body: alias('content')
});
