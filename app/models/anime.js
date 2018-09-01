import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Media from 'client/models/media';
import EpisodicMixin from 'client/mixins/models/episodic';
import { computed } from '@ember/object';

export default Media.extend(EpisodicMixin, {
  ageRating: attr('string'),
  ageRatingGuide: attr('string'),
  youtubeVideoId: attr('string'),

  animeProductions: hasMany('anime-production'),
  streamingLinks: hasMany('streaming-link'),

  shouldShowAds: computed('nsfw', 'ageRating', function() {
    return !(this.nsfw || this.ageRating == 'R');
  })
});
