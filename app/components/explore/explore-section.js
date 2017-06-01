import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { or } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['explore-section'],
  more: 'explore.more',
  limit: 5,
  ajax: service(),
  store: service(),
  queryCache: service(),
  results: or('getDataTask.last.value', 'getTrendingDataTask.last.value'),


  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'type') === 'trending') {
      get(this, 'getTrendingDataTask').perform();
    } else {
      get(this, 'getDataTask').perform();
    }
  },

  getDataTask: task(function* () {
    const type = get(this, 'mediaType');
    const options = this._getRequestOptions();
    return yield get(this, 'queryCache').query(type, options);
  }).drop(),

  getTrendingDataTask: task(function* () {
    const type = get(this, 'mediaType');
    const categoryId = get(this, 'category.id');
    const limit = get(this, 'limit');
    const path = `/trending/${type}?in_category=true&category=${categoryId}&limit=${limit}`;

    // does a cache entry exist?
    const cachedRecords = yield get(this, 'queryCache').get('trending', path);
    if (cachedRecords) {
      return cachedRecords;
    }

    // query the trending API
    const response = yield get(this, 'ajax').request(path);
    const records = [];
    response.data.forEach((data) => {
      const normalize = get(this, 'store').normalize(type, data);
      const record = get(this, 'store').push(normalize);
      records.addObject(record);
    });

    // push into cache
    get(this, 'queryCache').push('trending', path, records);
    return records;
  }).drop(),

  _getRequestOptions() {
    const options = {
      filter: {},
      sort: get(this, 'sort'),
      page: { limit: get(this, 'limit') }
    };

    const filters = get(this, 'filters');
    if (filters) {
      options.filter = filters.split(',').reduce((prev, current) => {
        const [key, value] = current.split(':');
        prev[key] = value; // eslint-disable-line
        return prev;
      }, {});
    }

    const category = get(this, 'category');
    if (category) {
      options.filter.categories = get(category, 'slug');
    }
    return options;
  },
});
