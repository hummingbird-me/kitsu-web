import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import observer from 'ember-metal/observer';
import { modelType } from 'client/helpers/model-type';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  classNames: ['poster-wrapper'],
  entry: null,
  media: undefined,
  trailerOpen: false,
  hasHovered: false,

  notify: service(),
  session: service(),
  store: service(),

  didInsertElement() {
    this._super(...arguments);
    this.$().hoverIntent(() => {
      if (get(this, 'hasHovered') === false) {
        this._getLibraryEntry();
        set(this, 'hasHovered', true);
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$().off('mouseenter.hoverIntent');
  },

  _onAuthentication: observer('session.hasUser', function() {
    if (get(this, 'hasHovered') === true) {
      this._getLibraryEntry();
    }
  }),

  _getLibraryEntry() {
    // already done a request
    if (get(this, 'entry') !== null) {
      return;
    }

    const media = get(this, 'media');
    const promise = get(this, 'store').query('library-entry', {
      filter: {
        user_id: get(this, 'session.account.id'),
        media_type: capitalize(modelType([media])),
        media_id: get(media, 'id')
      },
    }).then((results) => {
      const entry = get(results, 'firstObject');
      set(this, 'entry', entry);
      if (entry !== undefined) {
        set(this, 'entry.media', media);
      }
    });
    set(this, 'entry', promise);
  },

  actions: {
    getLibrary() {
      if (get(this, 'session.hasUser') === true) {
        this._getLibraryEntry();
      }
    },

    createEntry(status) {
      const user = get(this, 'session.account');
      const entry = get(this, 'store').createRecord('library-entry', {
        status,
        user,
        media: get(this, 'media')
      });
      return entry.save().then(() => set(this, 'entry', entry))
        .catch(err => get(this, 'notify').error(errorMessages(err)));
    },

    updateEntry(status) {
      set(this, 'entry.status', status);
      get(this, 'entry').save()
        .catch((err) => {
          get(this, 'entry').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },

    deleteEntry() {
      get(this, 'entry').destroyRecord()
        .then(() => set(this, 'entry', undefined))
        .catch((err) => {
          get(this, 'entry').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    }
  }
});
