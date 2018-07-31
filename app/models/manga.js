import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Media from 'client/models/media';

export default Media.extend({
  chapterCount: attr('number'),
  serialization: attr('string'),
  volumeCount: attr('number'),

  chapters: hasMany('chapter', { inverse: 'manga' })
});
