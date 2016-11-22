import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import observer from 'ember-metal/observer';
import { modelType } from 'client/helpers/model-type';

export default Component.extend({
  classNames: ['poster-wrapper'],
  media: undefined,
  trailerOpen: false,
  hasHovered: false,

  i18n: service(),
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
    createEntry(status) {
      const user = get(this, 'session.account');
      const entry = get(this, 'store').createRecord('library-entry', {
        status,
        user,
        media: get(this, 'media')
      });
      return entry.save().then(() => set(this, 'entry', entry))
        .catch(() => get(this, 'notify').error(get(this, 'i18n').t('errors.request')));
    },

    updateEntry(status) {
      set(this, 'entry.status', status);
      get(this, 'entry').save()
        .catch(() => {
          get(this, 'entry').rollbackAttributes();
          get(this, 'notify').error(get(this, 'i18n').t('errors.request'));
        });
    },

    deleteEntry() {
      get(this, 'entry').destroyRecord()
        .then(() => set(this, 'entry', undefined))
        .catch(() => {
          get(this, 'entry').rollbackAttributes();
          get(this, 'notify').error(get(this, 'i18n').t('errors.request'));
        });
    }
  }
});
