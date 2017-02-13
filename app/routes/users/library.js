import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { storageFor } from 'ember-local-storage';
import libraryStatus from 'client/utils/library-status';
import PaginationMixin from 'client/mixins/routes/pagination';
import errorMessages from 'client/utils/error-messages';
import getTitleField from 'client/utils/get-title-field';

export default Route.extend(PaginationMixin, {
  queryParams: {
    media: { refreshModel: true },
    status: { refreshModel: true },
    sort: { refreshModel: true }
  },
  intl: service(),
  notify: service(),
  metrics: service(),
  lastUsed: storageFor('last-used'),

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
    return {
      taskInstance: get(this, 'queryLibraryEntriesTask').perform(params)
    };
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'user', this.modelFor('users'));
  },

  titleToken() {
    const model = this.modelFor('users');
    const name = get(model, 'name');
    return get(this, 'intl').t('titles.users.library', { user: name });
  },

  /**
   * Restartable task that queries the library entries for the current status,
   * and media type.
   */
  queryLibraryEntriesTask: task(function* ({ media, status, sort }) {
    const user = this.modelFor('users');
    const userId = get(user, 'id');
    const options = {};

    // apply user sort selection
    if (sort !== undefined) {
      Object.assign(options, { sort: this._getUsableSort(sort) });
    }

    if (status === 'all') {
      status = '1,2,3,4,5'; // eslint-disable-line no-param-reassign
      if (sort !== undefined) {
        Object.assign(options, { sort: ['status', get(options, 'sort')].join(',') });
      } else {
        Object.assign(options, { sort: 'status,-updated_at' });
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      status = libraryStatus.enumToNumber(status);
      if (sort === undefined) {
        Object.assign(options, { sort: '-updated_at' });
      }
    }

    Object.assign(options, {
      include: `${media},user`,
      filter: {
        user_id: userId,
        kind: media,
        status
      },
      page: { offset: 0, limit: 200 }
    });
    return yield get(this, 'store').query('library-entry', options);
  }).restartable(),

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
        return entry.save()
          .then(() => get(this, 'notify').success('Your library entry was updated!'))
          .catch((err) => {
            entry.rollbackAttributes();
            get(this, 'notify').error(errorMessages(err));
          });
      }
    },

    deleteEntry(entry) {
      return entry.destroyRecord()
        .catch((err) => {
          entry.rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },

    changeSort({ type, direction }) {
      const controller = this.controllerFor(get(this, 'routeName'));
      const sort = direction === 'desc' ? `-${type}` : type;
      set(controller, 'sort', sort);
    }
  }
});
