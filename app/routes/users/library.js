import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import { storageFor } from 'ember-local-storage';
import { task } from 'ember-concurrency';
import getTitleField from 'client/utils/get-title-field';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  ajax: service(),
  intl: service(),
  queryCache: service(),
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

  /**
   * Remove a group of library entries in a bulk update.
   */
  removeEntriesTask: task(function* (entries) {
    const ids = entries.map(entry => get(entry, 'id'));
    yield get(this, 'ajax').request('/library-entries/_bulk', {
      method: 'DELETE',
      data: JSON.stringify({ filter: { id: ids.join(',') } })
    });
    // delete the records locally, as we used ajax
    entries.forEach((entry) => {
      entry.deleteRecord();
    });
  }).drop(),

  /**
   * Update the status of a group of library entries in a bulk update.
   */
  updateStatusTask: task(function* (entries, status) {
    const ids = entries.map(entry => get(entry, 'id'));
    const response = yield get(this, 'ajax').request('/library-entries/_bulk', {
      method: 'PATCH',
      data: JSON.stringify({
        filter: { id: ids.join(',') },
        data: { attributes: { status } }
      })
    });
    // invalidate cache
    get(this, 'queryCache').invalidateType('library-entry');
    // push serialized records into the store
    const data = response.data;
    data.forEach((entry) => {
      const normalizedData = get(this, 'store').normalize('library-entry', entry);
      get(this, 'store').push(normalizedData);
    });
  }).drop(),

  /**
   * Delete the user's entire library.
   */
  resetLibraryTask: task(function* () {
    yield get(this, 'ajax').request('/library-entries/_bulk', {
      method: 'DELETE',
      data: JSON.stringify({ filter: { user_id: get(this, 'session.account.id') } })
    });
    // invalidate cache
    get(this, 'queryCache').invalidateType('library-entry');
    // delete all local records belonging to the user
    let entries = get(this, 'store').peekAll('library-entry');
    entries = entries.filterBy('user.id', get(this, 'session.account.id'));
    entries.forEach((entry) => {
      entry.deleteRecord();
    });
  }).drop(),

  actions: {
    refreshModel() {
      this.refresh();
    },

    saveEntry(changeset) {
      return changeset.save().then(() => {
        get(this, 'queryCache').invalidateType('library-entry');
      }).catch((error) => {
        get(this, 'raven').captureException(error);
      });
    },

    removeEntry(entry) {
      return entry.destroyRecord().catch((error) => {
        entry.rollbackAttributes();
        get(this, 'raven').captureException(error);
      });
    },

    removeEntriesBulk(entries) {
      return get(this, 'removeEntriesTask').perform(entries);
    },

    updateStatusBulk(entries, status) {
      return get(this, 'updateStatusTask').perform(entries, status);
    },

    resetLibrary() {
      return get(this, 'resetLibraryTask').perform();
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
      delete options.sort;
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
