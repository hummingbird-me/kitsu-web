import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({
  isMarking: false,
  isPlaying: false,
  video: null,
  episode: null,
  media: null,

  didUpdateAttrs() {
    set(this, 'video', null);
    this._super(...arguments);
  }
});
