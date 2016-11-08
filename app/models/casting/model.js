import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  featured: attr('boolean', { defaultValue: false }),
  language: attr('string'),
  role: attr('string'),
  voiceActor: attr('boolean', { defaultValue: false }),

  character: belongsTo('character'),
  media: belongsTo('media'),
  person: belongsTo('person')
});
