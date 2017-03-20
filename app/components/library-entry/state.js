import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { bool } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['library-state'],

  cache: service('local-cache'),
  store: service(),
  hasLibraryEntry: bool('getLibraryEntryTask.last.value'),

  didReceiveAttrs() {
    this._super(...arguments);
    const media = get(this, 'media');
    if (get(media, 'id') !== get(this, '_mediaIdWas') && get(this, 'session.hasUser')) {
      get(this, 'getLibraryEntryTask').perform().then((libraryEntry) => {
        set(this, 'libraryEntry', libraryEntry);
      });
    }
    set(this, '_mediaIdWas', get(media, 'id'));
  },

  getLibraryEntryTask: task(function* () {
    const media = get(this, 'media');
    const type = get(media, 'modelType');

    const cacheKey = `${type}-${get(media, 'id')}`;
    const cachedEntry = this._getCacheLibraryEntry(cacheKey);
    if (cachedEntry) {
      return cachedEntry;
    }

    return yield get(this, 'store').query('library-entry', {
      filter: {
        user_id: get(this, 'session.account.id'),
        kind: type,
        [`${type}_id`]: get(media, 'id')
      }
    }).then(records => get(records, 'firstObject'));
  }).restartable(),

  actions: {
    libraryEntryCreated(libraryEntry) {
      set(this, 'libraryEntry', libraryEntry);
    }
  },

  _getCacheLibraryEntry(key) {
    const id = get(this, 'cache').getFromCache('library-entry', key);
    return id ? get(this, 'store').peekRecord('library-entry', id) : null;
  }
});
