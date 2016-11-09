import Controller from 'ember-controller';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { image } from 'client/helpers/image';

export default Controller.extend({
  media: alias('model'),
  session: service(),

  // Determine if the streamers are loaded so we can show a async loading state
  isStreamersLoaded: computed('media.streamingLinks.@each.streamer', {
    get() {
      const links = get(this, 'media.streamingLinks');
      if (get(links, 'isLoaded') === false) {
        return false;
      }
      return get(this, 'media.streamingLinks').toArray()
        .map(r => get(r, 'streamer'))
        .every(r => get(r, 'isLoaded') === true);
    }
  }).readOnly(),

  totalProgressText: computed('media.episodeCount', {
    get() {
      return get(this, 'media.episodeCount') || '-';
    }
  }).readOnly(),

  coverImageStyle: computed('media.coverImage', {
    get() {
      // TODO: Support offset
      const coverImage = image([get(this, 'media.coverImage')]);
      return `background-image: url("${coverImage}")`.htmlSafe();
    }
  }).readOnly(),

  actions: {
    sanitizeNumber(value) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
  }
});
