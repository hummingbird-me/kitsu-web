import MediaIndexController from 'client/media/index/controller';

export default MediaIndexController.extend({
  queryParams: ['ageRating', 'episodeCount', 'streamers'],
  ageRating: [],
  episodeCount: [1, 100],
  streamers: [],

  availableRatings: ['G', 'PG', 'R', 'R18']
});
