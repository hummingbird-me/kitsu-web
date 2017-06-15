import Component from 'ember-component';
import computed from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { image } from 'client/helpers/image';

export default Component.extend({
  classNames: ['reaction-modal'],
  store: service(),
  content: '',

  remaining: computed('content', function() {
    return 140 - (get(this, 'content.length') || 0);
  }).readOnly(),

  valid: computed('remaining', function() {
    return get(this, 'remaining') >= 0;
  }).readOnly(),

  posterImageStyle: computed('media.posterImage', function() {
    const posterImage = image(get(this, 'media.posterImage'));
    return `background-image: url("${posterImage}")`.htmlSafe();
  }).readOnly(),

  createReaction: task(function* () {
    const { reaction, content } = getProperties(this, 'reaction', 'content');
    set(reaction, 'reaction', content);
    return yield reaction.save();
  }).drop(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'libraryEntry.mediaReaction').then((reaction) => {
      if (reaction !== null) {
        setProperties(this, { reaction, content: get(reaction, 'reaction') });
      } else {
        const {
          media,
          libraryEntry,
          session: { account: user },
        } = getProperties(this, 'media', 'libraryEntry', 'session');
        const type = get(media, 'modelType');
        const createdReaction = get(this, 'store').createRecord('media-reaction', {
          [type]: media, user, libraryEntry
        });
        set(this, 'reaction', createdReaction);
      }
    });
  },

  actions: {
    createReaction() {
      if (get(this, 'valid') === true) {
        get(this, 'createReaction').perform().then(() => {
          invokeAction(this, 'onClose');
        });
      }
    }
  }
});
