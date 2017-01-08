import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Media from 'client/models/media';
import EpisodicMixin from 'client/mixins/models/episodic';

export default Media.extend(EpisodicMixin, {
  ageRating: attr('string'),
  ageRatingGuide: attr('string'),
  youtubeVideoId: attr('string'),

  streamingLinks: hasMany('streaming-link')
});
