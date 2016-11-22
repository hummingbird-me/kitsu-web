import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import observer from 'ember-metal/observer';
import { task, timeout } from 'ember-concurrency';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';
import { modelType } from 'client/helpers/model-type';

export default Route.extend(CanonicalRedirectMixin, CoverPageMixin, {
  templateName: 'media/show',
  i18n: service(),
  notify: service(),
  session: service(),

  saveEntryTask: task(function* (entry) {
    yield timeout(500);
    return yield entry.save().catch(() => {
      entry.rollbackAttributes();
      get(this, 'notify').error(get(this, 'i18n').t('errors.request'));
    });
  }).restartable(),

  model({ slug }) {
    const [type] = get(this, 'routeName').split('.');
    if (slug.match(/\D+/)) {
      return get(this, 'store').query(type, { filter: { slug }, include: 'genres' })
        .then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord(type, slug, { include: 'genres' });
  },

  setupController(controller, model) {
    this._super(...arguments);
    if (get(this, 'session.hasUser') === true) {
      this._getLibraryEntry(controller, model);
    }
  },

  titleToken(model) {
    return get(model, 'canonicalTitle');
  },

  serialize(model) {
    return { slug: get(model, 'slug') };
  },

  _getLibraryEntry(controller, media) {
    const promise = get(this, 'store').query('library-entry', {
      filter: {
        user_id: get(this, 'session.account.id'),
        media_type: capitalize(modelType([media])),
        media_id: get(media, 'id')
      },
    }).then((results) => {
      const entry = get(results, 'firstObject');
      set(controller, 'entry', entry);
      if (entry !== undefined) {
        set(controller, 'entry.media', media);
      }
    });
    set(controller, 'entry', promise);
  },

  // if the user authenticates while on this page, attempt to get their entry
  _userAuthenticated: observer('session.hasUser', function() {
    if (get(this, 'session.hasUser') === true) {
      this._getLibraryEntry(this.controllerFor(get(this, 'routeName')), this.modelFor(get(this, 'routeName')));
    }
  }),

  actions: {
    createEntry(status) {
      const controller = this.controllerFor(get(this, 'routeName'));
      const user = get(this, 'session.account');
      const media = this.modelFor(get(this, 'routeName'));
      const entry = get(this, 'store').createRecord('library-entry', {
        status,
        user,
        media
      });
      return entry.save().then(() => set(controller, 'entry', entry)).catch(() => {
        get(this, 'notify').error(get(this, 'i18n').t('errors.request'));
      });
    },

    updateEntry(entry, property, status) {
      set(entry, property, status);
      return entry.save().catch(() => {
        entry.rollbackAttributes();
        get(this, 'notify').error(get(this, 'i18n').t('errors.request'));
      });
    },

    deleteEntry(entry) {
      const controller = this.controllerFor(get(this, 'routeName'));
      return entry.destroyRecord()
        .then(() => set(controller, 'entry', undefined))
        .catch(() => {
          entry.rollbackAttributes();
          get(this, 'notify').error(get(this, 'i18n').t('errors.request'));
        });
    },

    saveEntryDebounced(entry) {
      get(this, 'saveEntryTask').perform(entry);
    }
  }
});
