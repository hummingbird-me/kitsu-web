import attr from 'ember-data/attr';
import Media from 'client/models/media';

export default Media.extend({
  chapterCount: attr('number'),
  serialization: attr('string'),
  volumeCount: attr('number')
});
