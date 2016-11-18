import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  foreignId: attr('string'),
  progress: attr('number'),
  rating: attr('number'),
  status: attr('string'),
  streamId: attr('string'),
  time: attr('utc'),
  verb: attr('string'),

  actor: belongsTo('user'),
  media: belongsTo('media'),
  subject: belongsTo('base'),
  unit: belongsTo('base')
});
