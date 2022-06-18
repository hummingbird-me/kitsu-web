import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';
import { isEmpty } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import { strictInvokeAction } from 'ember-invoke-action';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'kitsu-shared/mixins/pagination';

const ALGOLIA_INDICES = {
  character: {
    index: 'characters',
    fields: ['id', 'slug', 'canonicalName', 'image']
  },
  anime: {
    index: 'media',
    fields: ['id', 'slug', 'canonicalTitle'],
    filters: 'kind:anime'
  },
  manga: {
    index: 'media',
    fields: ['id', 'slug', 'canonicalTitle'],
    filters: 'kind:manga'
  }
};

export default Component.extend(Pagination, {
  algolia: service(),
  store: service(),

  favorites: concat(
    'getFavoritesTask.lastSuccessful.value',
    'paginatedRecords'
  ),
  filteredFavorites: computed(
    'favorites.@each.{isDeleted,favRank}',
    function () {
      return get(this, 'favorites').rejectBy('isDeleted').sortBy('favRank');
    }
  ).readOnly(),

  init() {
    this._super(...arguments);
    set(this, 'isCharacter', get(this, 'type') === 'character');
    get(this, 'getFavoritesTask').perform();
  },

  getFavoritesTask: task(function* () {
    const type = get(this, 'type');
    const options = {
      filter: {
        user_id: get(this, 'session.account.id'),
        item_type: capitalize(type)
      },
      fields: this._getFieldsets(type),
      include: 'item',
      sort: 'fav_rank',
      page: { limit: 20 }
    };
    return yield this.queryPaginated('favorite', options).then((records) => {
      records.forEach((record) => {
        strictInvokeAction(this, 'addRecord', record);
      });
      return records;
    });
  }),

  searchTask: task(function* (query) {
    yield timeout(200);
    const indexInfo = ALGOLIA_INDICES[get(this, 'type')];
    const index = yield this.get('algolia.getIndex').perform(indexInfo.index);
    if (isEmpty(index) || isEmpty(query)) {
      return [];
    }
    const response = yield index.search(query, {
      filters: indexInfo.filters,
      attributesToRetrieve: indexInfo.fields,
      attributesToHighlight: [],
      queryLanguages: ['en', 'ja'],
      naturalLanguages: ['en', 'ja'],
      hitsPerPage: 20,
      responseFields: ['hits'],
      removeStopWords: false,
      removeWordsIfNoResults: 'allOptional'
    });
    return response.hits;
  }).restartable(),

  onPagination(records) {
    this._super(records);
    records.forEach((record) => {
      strictInvokeAction(this, 'addRecord', record);
    });
  },

  actions: {
    reorderItems(orderedItems) {
      orderedItems.forEach((item) =>
        set(item, 'favRank', orderedItems.indexOf(item) + 1)
      );
    },

    addFavorite(item) {
      this.store.findRecord(this.get('type'), item.id).then((itemRecord) => {
        const record = get(this, 'store').createRecord('favorite', {
          user: get(this, 'session.account'),
          item: itemRecord
        });
        get(this, 'paginatedRecords').addObject(record);
        strictInvokeAction(this, 'addRecord', record);
        // @TODO: Should be moved to adapter level
        get(this, 'session.account').incrementProperty('favoritesCount');
      });
    },

    removeFavorite(favorite) {
      favorite.deleteRecord();
      const favorites = get(this, 'filteredFavorites');
      favorites.forEach((item) =>
        set(item, 'favRank', favorites.indexOf(item) + 1)
      );
    }
  },

  _getFieldsets(type) {
    if (type === 'character') {
      return { characters: ['name', 'image'].join(',') };
    }
    return {
      [type]: ['slug', 'posterImage', 'canonicalTitle', 'titles'].join(',')
    };
  }
});
