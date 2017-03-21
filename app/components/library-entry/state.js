import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { bool, readOnly } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['library-state'],

  cache: service('local-cache'),
  store: service(),
  hasLibraryEntry: bool('libraryEntry'),
  mediaType: readOnly('media.modelType'),

  didReceiveAttrs() {
    this._super(...arguments);
    const media = get(this, 'media');
    if (get(media, 'id') !== get(this, '_mediaIdWas') && get(this, 'session.hasUser')) {
      get(this, 'getLibraryEntryTask').perform().then((libraryEntry) => {
        if (libraryEntry) {
          set(libraryEntry, get(this, 'mediaType'), get(this, 'media'));
        }
        set(this, 'libraryEntry', libraryEntry);
      });
    }
    set(this, '_mediaIdWas', get(media, 'id'));
  },

  getLibraryEntryTask: task(function* () {
    const media = get(this, 'media');
    const type = get(this, 'mediaType');
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

  createLibraryEntryTask: task(function* (status, rating) {
    const type = get(this, 'mediaType');
    const libraryEntry = get(this, 'store').createRecord('library-entry', {
      status,
      rating,
      user: get(this, 'session.account'),
      [type]: get(this, 'media')
    });
    return yield libraryEntry.save();
  }).drop(),

  removeLibraryEntryTask: task(function* () {
    const libraryEntry = get(this, 'libraryEntry');
    return yield libraryEntry.destroyRecord();
  }).drop(),

  updateLibraryEntryTask: task(function* () {
    const libraryEntry = get(this, 'libraryEntry');
    return yield libraryEntry.save();
  }).enqueue(),

  actions: {
    createLibraryEntry(status, rating) {
      get(this, 'createLibraryEntryTask').perform(status, rating).then((libraryEntry) => {
        set(libraryEntry, get(this, 'mediaType'), get(this, 'media'));
        set(this, 'libraryEntry', libraryEntry);
      });
    },

    removeLibraryEntry() {
      get(this, 'removeLibraryEntryTask').perform().then(() => {
        set(this, 'libraryEntry', null);
      }).catch(() => {
        get(this, 'libraryEntry').rollbackAttributes();
      });
    },

    updateAttribute(attribute, value) {
      set(this, `libraryEntry.${attribute}`, value);
      get(this, 'updateLibraryEntryTask').perform().catch(() => {
        get(this, 'libraryEntry').rollbackAttributes();
      });
    }
  },

  _getCacheLibraryEntry(key) {
    const id = get(this, 'cache').getFromCache('library-entry', key);
    return id ? get(this, 'store').peekRecord('library-entry', id) : null;
  }
});
