import Component from '@ember/component';
import { get, computed } from '@ember/object';

// TODO: move this to the server's Streamer model
const STREAMING_LINKS = {
  hulu: {
    name: 'Hulu',
    link: '#',
    description: 'More anime awaits, on Hulu.',
    cta: 'Start your free trial',
    logo: 'hulu-lg'
  }
};

export default Component.extend({
  classNames: ['streamer-plug'],
  classNameBindings: ['streamerClassName'],

  streamer: null,

  streamerClassName: computed('streamer', function () {
    return `${get(this, 'streamer')}-plug`;
  }),

  streamerInfo: computed('streamer', function () {
    return STREAMING_LINKS[get(this, 'streamer')];
  })
});
