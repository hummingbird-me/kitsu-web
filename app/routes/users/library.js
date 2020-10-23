import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { storageFor } from 'ember-local-storage';
import { task } from 'ember-concurrency';
import { getTitleField } from 'client/utils/get-title-field';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  ajax: service(),
  intl: service(),
  queryCache: service(),
  raven: service(),
  cache: storageFor('last-used'),

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
    entries.forEach(entry => {
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
    const { data } = response;
    data.forEach(entry => {
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
    entries.forEach(entry => {
      entry.deleteRecord();
    });
  }).drop(),

  actions: {
    refreshModel() {
      this.refresh();
    },

    saveEntry(entry) {
      return entry.save().then(() => {
        get(this, 'queryCache').invalidateType('library-entry');
      });
    },

    removeEntry(entry) {
      return entry.destroyRecord().catch(error => {
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
    let sortKey;

    // get the correct sorting key
    switch (sort) {
      case 'watched': {
        sortKey = 'progressed_at';
        break;
      }
      case 'started':
      case 'finished': {
        sortKey = `${sort}_at`;
        break;
      }
      case 'added': {
        sortKey = 'created_at';
        break;
      }
      case 'title': {
        const field = `${mediaType}.titles`;
        // If the user is logged in, then we want to use their preferred title preference
        if (get(this, 'session.hasUser')) {
          const preference = get(this, 'session.account.titleLanguagePreference');
          const key = getTitleField(preference.toLowerCase());
          sortKey = `${field}.${key}`;
        } else {
          sortKey = `${field}.canonical`;
        }
        break;
      }
      case 'length': {
        sortKey = mediaType === 'anime' ? 'anime.episode_count' : 'manga.chapter_count';
        break;
      }
      default: {
        sortKey = sort;
      }
    }

    let direction = get(controller, 'direction');
    // reverse direction for title sorting
    if (sort === 'title') {
      direction = direction === 'desc' ? 'asc' : 'desc';
    }
    return direction === 'desc' ? `-${sortKey}` : sortKey;
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
      include: `${media},user,mediaReaction`,
      filter: {
        user_id: get(user, 'id'),
        kind: media,
        status
      },
      page: {
        offset: 0,
        limit: 40
      }
    };

    // apply user sort selection
    if (sort) {
      options.sort = this._getSortingKey(sort);
    } else {
      options.sort = '-updated_at';
    }

    if (status === 'all') {
      options.sort = `status,${options.sort}`;
      delete options.filter.status;
    }

    // request only the fields that we require for display
    options.fields = this._getFieldsets(media);

    // searching?
    if (isPresent(title)) {
      options.filter.title = title;
      delete options.filter.status;
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
    const unitCount = media === 'anime' ? 'episodeCount' : 'chapterCount,volumeCount';
    return {
      [media]: [
        'slug',
        'posterImage',
        'canonicalTitle',
        'titles',
        'description',
        'subtype',
        'startDate',
        'status',
        'averageRating',
        'popularityRank',
        'ratingRank',
        unitCount
      ].join(','),
      users: 'id'
    };
  }
});
