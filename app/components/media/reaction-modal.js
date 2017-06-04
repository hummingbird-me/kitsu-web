import Component from 'ember-component';
import computed from 'ember-computed';
import get, { getProperties } from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  queryCache: service(),

  remaining: computed('reaction', function() {
    return 140 - (get(this, 'reaction.length') || 0);
  }),

  createReaction: task(function* () {
    const { media, session: { account: user }, reaction } =
      getProperties(this, 'media', 'session', 'reaction');
    const type = get(media, 'modelType');
    const libraryEntry = yield get(this, 'queryCache').query('library-entry', {
      filter: {
        userId: get(user, 'id'),
        kind: type,
        [`${type}Id`]: get(media, 'id')
      }
    }).then(records => get(records, 'firstObject'));
    const createdReaction = get(this, 'store').createRecord('media-reaction', {
      [type]: media, user, reaction, libraryEntry
    });
    yield createdReaction.save();
  }).drop()
});
