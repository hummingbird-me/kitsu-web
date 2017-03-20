import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import HoverIntentMixin from 'client/mixins/hover-intent';

export default Component.extend(HoverIntentMixin, {
  cache: service('local-cache'),
  store: service(),

  _onMouseEnter() {
    this._super(...arguments);
    this._getLibraryEntry();
  },

  _getLibraryEntry() {
    // user isn't logged in.
    if (!get(this, 'session.hasUser')) {
      return;
    }

    // check if we already have this entry in store.
    const entry = this._checkLocalStore();
    if (entry) {
      set(this, 'entry', entry);
    } else {
      this._requestLibraryEntry();
    }
  },

  _checkLocalStore() {
    const mediaId = get(this, 'media.id');
    const mediaType = get(this, 'media.modelType');
    const lookupKey = `${mediaType}-${mediaId}`;
    const id = get(this, 'cache').getFromCache('library-entry', lookupKey);
    return get(this, 'store').peekRecord('library-entry', id);
  },

  _requestLibraryEntry() {
    const media = get(this, 'media');
    const type = get(media, 'modelType');
    const promise = get(this, 'store').query('library-entry', {
      filter: {
        kind: type,
        [`${type}_id`]: get(media, 'id'),
        user_id: get(this, 'session.account.id')
      }
    }).then((results) => {
      if (get(this, 'isDestroying') || get(this, 'isDestroyed')) { return; }
      const entry = get(results, 'firstObject');
      set(this, 'entry', entry);
      if (entry !== undefined) {
        set(this, `entry.${type}`, media);
        this._addToStore();
      }
    });
    set(this, 'entry', promise);
  },

  _addToStore() {
    const type = get(this, 'media.modelType');
    const id = get(this, 'media.id');
    const lookupKey = `${type}-${id}`;
    const entryId = get(this, 'entry.id');
    get(this, 'cache').addToCache('library-entry', lookupKey, entryId);
  },

  actions: {
    createEntry(status) {
      const user = get(this, 'session.account');
      const type = get(this, 'media.modelType');
      const entry = get(this, 'store').createRecord('library-entry', {
        status,
        user,
        [type]: get(this, 'media')
      });
      return entry.save().then(() => {
        set(this, 'entry', entry);
        this._addToStore();
      });
    },

    updateEntry(status) {
      set(this, 'entry.status', status);
      return get(this, 'entry').save().catch(() => {
        get(this, 'entry').rollbackAttributes();
      });
    },

    deleteEntry() {
      return get(this, 'entry').destroyRecord().then(() => {
        set(this, 'entry', undefined);
      }).catch(() => {
        get(this, 'entry').rollbackAttributes();
      });
    }
  }
});
