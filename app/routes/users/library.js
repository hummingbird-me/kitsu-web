import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { storageFor } from 'ember-local-storage';
import PaginationMixin from 'client/mixins/routes/pagination';
import getTitleField from 'client/utils/get-title-field';

export default Route.extend(PaginationMixin, {
  queryParams: {
    media: { refreshModel: true },
    status: { refreshModel: true },
    sort: { refreshModel: true },
    limit: { refreshModel: true }
  },
  i18n: service(),
  notify: service(),
  metrics: service(),
  lastUsed: storageFor('last-used'),

  /**
   * Restartable task that queries the library entries for the current status,
   * and media type.
   */
  modelTask: task(function* (params) {
    const { media, sort, limit } = params;
    let { status } = params;

    const user = this.modelFor('users');
    const userId = get(user, 'id');
    const options = {
      sort: this._getUsableSort(sort)
    };

    // if we are getting all, then sort by status first
    if (status === 'all') {
      // eslint-disable-next-line no-param-reassign
      status = 'current,planned,completed,on_hold,dropped';
      Object.assign(options, { sort: ['status', get(options, 'sort')].join(',') });
    }

    Object.assign(options, {
      include: `${media},user`,
      filter: {
        user_id: userId,
        kind: media,
        status
      },
      page: { offset: 0, limit }
    });
    const entries = yield get(this, 'store').query('library-entry', options);
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'taskValue', entries);
  }).restartable(),

  beforeModel({ queryParams }) {
    if (queryParams.media === undefined || queryParams.sort === undefined) {
      if (get(this, 'session').isCurrentUser(this.modelFor('users'))) {
        const lastUsed = get(this, 'lastUsed');
        const { libraryType, librarySort } = getProperties(lastUsed, 'libraryType', 'librarySort');
        if (libraryType || librarySort) {
          this.replaceWith({ queryParams: { media: libraryType, sort: librarySort } });
        }
      }
    }
  },

  model(params) {
    return { taskInstance: get(this, 'modelTask').perform(params) };
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'user', this.modelFor('users'));
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'i18n').t('titles.users.library', { user: name });
  },

  _getUsableSort(sort) {
    const controller = this.controllerFor(get(this, 'routeName'));
    const mediaType = get(controller, 'media');
    if (sort === 'type' || sort === '-type') {
      const field = `${mediaType}.subtype`;
      return sort.charAt(0) === '-' ? `-${field}` : field;
    } else if (sort === 'title' || sort === '-title') {
      let field = `${mediaType}.titles`;
      if (get(this, 'session.hasUser')) {
        const preference = get(this, 'session.account.titleLanguagePreference').toLowerCase();
        const key = getTitleField(preference);
        field = `${field}.${key}`;
      } else {
        field = `${field}.canonical`;
      }
      return sort.charAt(0) === '-' ? `-${field}` : field;
    }
    return sort;
  },

  actions: {
    saveEntry(entry) {
      if (get(entry, 'validations.isValid') === true) {
        // @TODO: Feedback should be removed from notify
        return entry.save().then(() => {
          get(this, 'notify').success('Your library entry was updated!');
        }).catch(() => {
          entry.rollbackAttributes();
        });
      }
    },

    deleteEntry(entry) {
      return entry.destroyRecord().catch(() => {
        entry.rollbackAttributes();
      });
    },

    changeSort(sortKey) {
      const controller = this.controllerFor(get(this, 'routeName'));
      set(controller, 'sort', sortKey);
    }
  }
});
