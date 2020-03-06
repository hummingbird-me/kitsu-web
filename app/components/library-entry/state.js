import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { bool, readOnly } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['library-state'],
  classNameBindings: ['showHeader:with-header'],
  showHeader: true,
  createOnly: false,
  reactionOpen: false,
  showEditModal: false,

  onCreate() {},
  onRemove() {},
  onUpdate() {},

  queryCache: service(),
  store: service(),
  hasLibraryEntry: bool('libraryEntry'),
  mediaType: readOnly('media.modelType'),

  didReceiveAttrs() {
    this._super(...arguments);
    const media = get(this, 'media');
    if (!('libraryEntry' in this.attrs)) {
      if (get(media, 'id') !== get(this, '_mediaIdWas') && get(this, 'session.hasUser')) {
        get(this, 'getLibraryEntryTask').perform().then(libraryEntry => {
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

  createLibraryEntryTask: task({
    * perform(status, rating) {
      // Warning: semi-private e-c API
      const owner = get(this, 'owner');
      const type = get(owner, 'mediaType');
      const libraryEntry = get(owner, 'store').createRecord('library-entry', {
        status,
        rating,
        user: get(owner, 'session.account'),
        [type]: get(owner, 'media')
      });
      get(owner, 'onCreate')(libraryEntry, this);
      try {
        set(owner, 'libraryEntry', libraryEntry);
        const response = yield libraryEntry.save();
        set(libraryEntry, get(owner, 'mediaType'), get(owner, 'media'));
        return response;
      } catch (error) {
        set(owner, 'libraryEntry', null);
        libraryEntry.rollbackAttributes();
        throw error;
      }
    }
  }).drop(),

  removeLibraryEntryTask: task({
    * perform() {
      // Warning: semi-private e-c API
      const owner = get(this, 'owner');
      const libraryEntry = get(owner, 'libraryEntry');
      get(owner, 'onRemove')(libraryEntry, this);
      try {
        set(owner, 'libraryEntry', null);
        const response = yield libraryEntry.destroyRecord();
        return response;
      } catch (error) {
        libraryEntry.rollbackAttributes();
        throw error;
      }
    }
  }).drop(),

  updateLibraryEntryTask: task({
    * perform(content) {
      // Warning: semi-private e-c API
      const owner = get(this, 'owner');
      const libraryEntry = content || get(owner, 'libraryEntry');
      // Send the task to the onUpdate function
      get(owner, 'onUpdate')(libraryEntry, this);
      try {
        yield libraryEntry.save();
        get(owner, 'queryCache').invalidateType('library-entry');
      } catch (error) {
        libraryEntry.rollbackAttributes();
        throw error;
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
