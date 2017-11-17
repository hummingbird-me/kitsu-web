import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  classNames: ['video-player'],

  store: service(),

  // Parameters
  video: null,
  // State
  loading: true,
  didMark: false,

  onProgress({ position, duration }) {
    if (get(this, 'didMark')) return;

    const progress = position / duration;
    const remaining = duration - position;

    // more than 90% done or less than 5 minutes remaining
    if (progress > 0.9 || remaining < 300) {
      set(this, 'didMark', true);
      invokeAction(this, 'onMark');
    }
  }
});
