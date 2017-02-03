import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed from 'ember-computed';

export default Component.extend({
  classNames: ['media-sidebar'],
  session: service(),

  // Determine if the streamers are loaded so we can show a async loading state
  isStreamersLoaded: computed('media.streamingLinks.@each.streamer', function() {
    const links = get(this, 'media.streamingLinks');
    if (!get(links, 'isLoaded')) { return false; }
    return get(this, 'media.streamingLinks').toArray()
      .map(r => get(r, 'streamer'))
      .every(r => get(r, 'isLoaded'));
  }).readOnly(),
});
