import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { bool, readOnly } from 'ember-computed';
import { task } from 'ember-concurrency';
import isChangeset from 'ember-changeset/utils/is-changeset';

export default Component.extend({
  classNames: ['library-state'],
  classNameBindings: ['showHeader:with-header'],
  showHeader: true,
  createOnly: false,
  reactionOpen: false,

  queryCache: service(),
  store: service(),
  hasLibraryEntry: bool('libraryEntry'),
  mediaType: readOnly('media.modelType'),

  didReceiveAttrs() {
    this._super(...arguments);
    const media = get(this, 'media');
    if (!('libraryEntry' in this.attrs)) {
      if (get(media, 'id') !== get(this, '_mediaIdWas') && get(this, 'session.hasUser')) {
        get(this, 'getLibraryEntryTask').perform().then((libraryEntry) => {
          if (libraryEntry) {
            set(libraryEntry, get(this, 'mediaType'), get(this, 'media'));
          }
          set(this, 'libraryEntry', libraryEntry);
        });
      }
    }
    set(this, '_mediaIdWas', get(media, 'id'));
  },

  getLibraryEntryTask: task(function* () {
    return yield get(this, 'queryCache').query('library-entry', this._getRequestOptions())
      .then(records => get(records, 'firstObject'));
  }).restartable(),

  createLibraryEntryTask: task(function* (status, rating) {
    const type = get(this, 'mediaType');
    const libraryEntry = get(this, 'store').createRecord('library-entry', {
      status,
      rating,
      user: get(this, 'session.account'),
      [type]: get(this, 'media')
    });
    try {
      set(this, 'libraryEntry', libraryEntry);
      const response = yield libraryEntry.save();
      set(libraryEntry, get(this, 'mediaType'), get(this, 'media'));
      return response;
    } catch (error) {
      set(this, 'libraryEntry', null);
      libraryEntry.rollbackAttributes();
    }
  }).drop(),

  removeLibraryEntryTask: task(function* () {
    const libraryEntry = get(this, 'libraryEntry');
    try {
      set(this, 'libraryEntry', null);
      return yield libraryEntry.destroyRecord();
    } catch (error) {
      libraryEntry.rollbackAttributes();
    }
  }).drop(),

  updateLibraryEntryTask: task(function* (content) {
    const libraryEntry = content || get(this, 'libraryEntry');
    try {
      yield libraryEntry.save();
      get(this, 'queryCache').invalidateType('library-entry');
    } catch (error) {
      if (isChangeset(libraryEntry)) {
        libraryEntry.rollback();
      } else {
        libraryEntry.rollbackAttributes();
      }
    }
  }).enqueue(),

  actions: {
    updateAttribute(attribute, value) {
      set(this, `libraryEntry.${attribute}`, value);
      get(this, 'updateLibraryEntryTask').perform();
    }
  },

  _getRequestOptions() {
    const type = get(this, 'mediaType');
    return {
      include: 'mediaReaction',
      filter: {
        user_id: get(this, 'session.account.id'),
        [`${type}_id`]: get(this, 'media.id')
      },
      page: { limit: 1 }
    };
  }
});
