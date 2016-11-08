import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  url: attr('string'),
  subs: attr('array'),
  dubs: attr('array'),

  media: belongsTo('media'),
  streamer: belongsTo('streamer')
});
