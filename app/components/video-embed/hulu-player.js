import Component from '@ember/component';
import { get, set, getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { injectScript } from 'client/utils/inject-script';

/* global HuluPlayer */
const HULU_API = '//player.hulu.com/iframe/iframe_api';

export default Component.extend({
  classNames: ['hulu-embed'],
  session: service(),

  videoId: '',
  width: 800,
  height: 600,
  onLoad() {},
  onProgress() {},

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
      const huluPlayerApi = document.getElementById('hulu-playerapi-script');
      huluPlayerApi.onload = () => this.initPlayer();
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    const videoId = get(this, 'videoId');
    this.changeVideo(videoId);
  },

  initPlayer() {
    const containerId = get(this, 'elementId');

    // Initialize the HuluPlayer instance
    const player = new HuluPlayer.DP(containerId, {
      ...getProperties(this, 'width', 'height'),
      id: get(this, 'videoId'),
      partner: 'kitsu',
      playerType: 'dash'
    });
    set(this, 'player', player);

    // Hook onto the events
    player.addEventListener('player_ready', () => get(this, 'onLoad')());
    player.addEventListener('videoMetadata', ({ data: { length } }) => {
      set(this, 'duration', length);
      get(this, 'onProgress')({ position: 0, duration: length });
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
  }
});
