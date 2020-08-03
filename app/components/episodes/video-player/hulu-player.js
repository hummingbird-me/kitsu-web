import Component from '@ember/component';
import { get, set, getProperties, observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { injectScript } from 'client/utils/inject-script';

/* global HuluPlayer */
const HULU_API = 'https://player.hulu.com/iframe/iframe_api';

export default Component.extend({
  classNames: ['hulu-embed'],
  session: service(),

  video: null,
  videoId: alias('video.embedData.eid'),
  width: 800,
  height: 600,
  onLoad() {},
  onProgress() {},
  isPlaying: false,

  init() {
    // Start loading the script ASAP
    injectScript(HULU_API);
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);
    // Hulu's script injects another (versioned) script which is what we want.  Thankfully they
    // set an ID on it that we can use to monitor loading
    injectScript(HULU_API).then(() => {
      if (HuluPlayer && HuluPlayer.DP) return this.initPlayer();
      const huluPlayerApi = document.getElementById('hulu-playerapi-script');
      huluPlayerApi.onload = () => this.initPlayer();
    });
  },

  videoDidChange: observer('video', function () {
    const videoId = get(this, 'videoId');
    this.changeVideo(videoId);
  }),

  playingDidUpdate: observer('isPlaying', function () {
    if (get(this, 'isPlaying')) {
      this.resume();
    } else {
      this.pause();
    }
  }),

  initPlayer() {
    const containerId = get(this, 'elementId');

    // Initialize the HuluPlayer instance
    const options = {
      ...getProperties(this, 'width', 'height'),
      id: get(this, 'videoId'),
      playerType: 'dash'
    };

    // tag this embed if needed
    const data = this.video && this.video.embedData;
    if (data && data.network === undefined) {
      options.partner = 'kitsu';
    }

    const player = new HuluPlayer.DP(containerId, options);
    set(this, 'player', player);

    // Hook onto the events
    player.addEventListener('player_ready', () => get(this, 'onLoad')());
    player.addEventListener('videoMetadata', ({ data: { length } }) => {
      if (!get(this, 'isPlaying')) this.pause();
      set(this, 'duration', length);
      get(this, 'onProgress')({ position: 0, duration: length });
    });
    player.addEventListener('videoStateChange', ({ data: state }) => {
      if (state === 'playing') {
        set(this, 'isPlaying', true);
      } else if (state === 'pause') {
        set(this, 'isPlaying', false);
      }
    });
    player.addEventListener('videoPlayheadUpdate', ({ data: { position, duration, state } }) => {
      if (state === 'ad') return;
      set(this, 'position', position);
      get(this, 'onProgress')({ position, duration });
    });
    player.loadPlayer();
  },

  changeVideo(videoId) {
    const player = get(this, 'player');
    if (!player) return;
    player.playVideo(videoId);
  },

  resume() {
    const player = get(this, 'player');
    if (player) player.resumeVideo();
  },

  pause() {
    const player = get(this, 'player');
    if (player) player.pauseVideo();
  }
});
