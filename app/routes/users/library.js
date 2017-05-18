import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import { storageFor } from 'ember-local-storage';
import getTitleField from 'client/utils/get-title-field';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
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
    refreshModel() {
      this.refresh();
    },

    saveEntry(changeset) {
      return changeset.save().catch((error) => {
        get(this, 'raven').captureException(error);
      });
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
  _getRequestOptions({ media, status, sort, title }) {
    const user = this.modelFor('users');
    const options = {
      include: `${media},user`,
      filter: {
        user_id: get(user, 'id'),
        kind: media,
        status
      },
      page: { offset: 0, limit: 40 }
    };

    // apply user sort selection
    if (sort) {
      options.sort = this._getSortingKey(sort);
    } else {
      options.sort = '-updated_at';
    }

    if (status === 'all') {
      options.filter.status = '1,2,3,4,5';
      options.sort = `status,${options.sort}`;
    }

    // request only the fields that we require for display
    options.fields = this._getFieldsets(media);

    // searching?
    if (isPresent(title)) {
      options.filter.title = title;
    }

    return options;
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
