import attr from 'ember-data/attr';
import Media from 'client/models/media';

export default Media.extend({
  mangaType: attr('string')
});
