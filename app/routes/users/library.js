import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { storageFor } from 'ember-local-storage';
import libraryStatus from 'client/utils/library-status';
import errorMessages from 'client/utils/error-messages';
import getTitleField from 'client/utils/get-title-field';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
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
          this.replaceWith({
            queryParams: {
              media: queryParams.media || libraryType,
              sort: queryParams.sort || librarySort
            }
          });
        }
      }
    }
  },

  model(params) {
    const options = this._getRequestOptions(params);
    return {
      taskInstance: this.queryPaginated('library-entry', options),
      paginatedRecords: []
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
          .then(() => {
            get(this, 'notify').success('Your library entry was updated!');
          })
          .catch((err) => {
            entry.rollbackAttributes();
            get(this, 'notify').error(errorMessages(err));
          });
      }
    },

    changeSort({ type, direction }) {
      const controller = this.controllerFor(get(this, 'routeName'));
      const sort = direction === 'desc' ? `-${type}` : type;
      set(controller, 'sort', sort);
    }
  },

  _getRequestOptions({ media, status, sort }) {
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

    // sparse fieldsets
    Object.assign(options, this._getFieldsets(media));

    return Object.assign(options, {
      include: `${media},user`,
      filter: {
        user_id: userId,
        kind: media,
        status
      },
      page: { offset: 0, limit: 200 }
    });
  },

  /**
   * Request only the fields that we need for this resource
   */
  _getFieldsets(media) {
    const unitCount = media === 'anime' ? 'episodeCount' : 'chapterCount';
    return {
      fields: {
        [media]: [
          'slug',
          'posterImage',
          'canonicalTitle',
          'titles',
          'synopsis',
          'subtype',
          'startDate',
          'endDate',
          unitCount
        ].join(','),
        users: 'id'
      }
    };
  }
});
