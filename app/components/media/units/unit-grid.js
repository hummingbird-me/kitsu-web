import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  queryCache: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (!get(this, 'session.hasUser')) { return; }
    get(this, 'getLibraryEntryTask').perform();
  },

  getLibraryEntryTask: task(function* () {
    const userId = get(this, 'session.account.id');
    const media = get(this, 'media');
    return yield get(this, 'queryCache').query('libraryEntry', {
      filter: {
        userId,
        [`${get(media, 'modelType')}_id`]: get(media, 'id')
      },
      fields: { libraryEntries: 'progress' },
      page: { limit: 1 }
    }).then(records => set(this, 'libraryEntry', get(records, 'firstObject')));
  }).drop()
});
