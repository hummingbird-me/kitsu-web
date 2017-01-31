import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  url: attr('string'),
  subs: attr('array'),
  dubs: attr('array'),

  media: belongsTo('media'),
  streamer: belongsTo('streamer')
});
