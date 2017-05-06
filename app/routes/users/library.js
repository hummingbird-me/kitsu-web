import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { storageFor } from 'ember-local-storage';
import getTitleField from 'client/utils/get-title-field';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  queryParams: {
    media: { refreshModel: true },
    status: { refreshModel: true },
    sort: { refreshModel: true }
  },

  intl: service(),
  cache: storageFor('last-used'),

  /**
   * Use the cached query param values for the user if this is the user's *own* page.
   * Only override the query param values if they aren't explicitly provided.
   */
  beforeModel({ queryParams }) {
    if (!queryParams.media || !queryParams.sort) {
      const isCurrentUser = get(this, 'session').isCurrentUser(this.modelFor('users'));
      if (isCurrentUser) {
        const cache = get(this, 'cache');
        const { libraryType, librarySort } = getProperties(cache, 'libraryType', 'librarySort');
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

  actions: {
    saveEntry(changeset) {
      return changeset.save();
    },

    removeEntry(entry) {
      return entry.destroyRecord().catch((error) => {
        entry.rollbackAttributes();
        get(this, 'raven').captureException(error);
      });
    }
  },

  /**
   * Convert the query param `sort` key into a key that the API expects.
   *
   * @param {String} sort
   * @returns {String}
   * @private
   */
  _getSortingKey(sort) {
    const controller = this.controllerFor(get(this, 'routeName'));
    const mediaType = get(controller, 'media');

    // get the correct sorting key
    switch (sort) {
      case 'watched':
      case '-watched': {
        return sort.replace('watched', 'progressed_at');
      }
      case 'title':
      case '-title': {
        let field = `${mediaType}.titles`;
        // If the user is logged in, then we want to use their preferred title preference
        if (get(this, 'session.hasUser')) {
          const preference = get(this, 'session.account.titleLanguagePreference');
          const key = getTitleField(preference.toLowerCase());
          field = `${field}.${key}`;
        } else {
          field = `${field}.canonical`;
        }
        return sort.charAt(0) === '-' ? `-${field}` : field;
      }
      case 'length':
      case '-length': {
        const field = mediaType === 'anime' ? 'anime.episode_count' : 'manga.chapter_count';
        return sort.replace('length', field);
      }
      default: {
        return sort;
      }
    }
  },

  /**
   * Build the JSON-API request options for the model hook
   *
   * @param {Object} Params
   * @returns {Object}
   * @private
   */
  _getRequestOptions({ media, status, sort }) {
    const user = this.modelFor('users');
    const options = {};

    // apply user sort selection
    if (sort) {
      const sortingKey = this._getSortingKey(sort);
      Object.assign(options, { sort: sortingKey });
    } else {
      Object.assign(options, { sort: '-updated_at' });
    }

    if (status === 'all') {
      status = '1,2,3,4,5'; // eslint-disable-line no-param-reassign
      const sortingKey = `status,${options.sort}`;
      Object.assign(options, { sort: sortingKey });
    }

    // request only the fields that we require for display
    const fields = this._getFieldsets(media);
    Object.assign(options, { fields });

    return Object.assign(options, {
      include: `${media},user`,
      filter: {
        user_id: get(user, 'id'),
        kind: media,
        status
      },
      page: { offset: 0, limit: 200 }
    });
  },

  /**
   * Request only the fields that we need for this resource
   *
   * @param {String} Media
   * @returns {Object}
   * @private
   */
  _getFieldsets(media) {
    const unitCount = media === 'anime' ? 'episodeCount' : 'chapterCount';
    return {
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
    };
  }
});
