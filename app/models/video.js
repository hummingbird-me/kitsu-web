import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  url: attr('string'),
  canonicalTitle: attr('string'),
  availableRegions: attr('array'),
  dubLang: attr('string'),
  subLang: attr('string'),
  embedData: attr('object'),

  episode: belongsTo('episode'),
  streamer: belongsTo('streamer')
});
