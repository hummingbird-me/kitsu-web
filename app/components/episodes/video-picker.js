import Component from '@ember/component';
import { get, set } from '@ember/object';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['video-picker'],

  queryCache: service(),

  // Properties
  episode: null,
  media: null,
  isPlaying: null,
  // Events
  onChange() {},
  onClickCurrent() {},
  // State
  videos: [],
  selectedVideo: null,
  episodes: [],

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getVideos').perform();
    get(this, 'getEpisodes').perform();
  },

  getVideos: task(function* () {
    const cache = get(this, 'queryCache');
    const episodeId = get(this, 'episode.id');

    const filter = { episodeId };
    const params = { filter };

    const videos = yield cache.query('video', params);

    if (!get(this, 'selectedVideo')) {
      const firstVideo = get(videos, 'firstObject');
      set(this, 'selectedVideo', firstVideo);
    }
    set(this, 'videos', videos);
  }),

  getEpisodes: task(function* () {
    const cache = get(this, 'queryCache');
    const mediaId = yield get(this, 'media.id');

    const filter = { mediaType: 'Anime', mediaId };
    const offset = get(this, 'episode.number') - 5;
    const page = { offset: Math.max(0, offset), limit: 9 };
    const params = { filter, page, sort: 'number' };

    const episodes = yield cache.query('episode', params);

    set(this, 'episodes', episodes);
  })
});
