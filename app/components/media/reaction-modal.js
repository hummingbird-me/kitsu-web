import Component from 'ember-component';
import computed from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  store: service(),
  content: '',

  remaining: computed('content', function() {
    return 140 - (get(this, 'content.length') || 0);
  }),

  createReaction: task(function* () {
    const { reaction, content } = getProperties(this, 'reaction', 'content');
    set(reaction, 'reaction', content);
    yield reaction.save().then(() => {
      invokeAction(this, 'onClose');
    });
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
  }
});
