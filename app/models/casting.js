import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  featured: attr('boolean', { defaultValue: false }),
  language: attr('string'),
  role: attr('string'),
  voiceActor: attr('boolean', { defaultValue: false }),

  character: belongsTo('character'),
  media: belongsTo('media'),
  person: belongsTo('person')
});
