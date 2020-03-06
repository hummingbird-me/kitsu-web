import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { typeOf } from '@ember/utils';
import { reads } from 'ember-computed';
import { task, taskGroup } from 'ember-concurrency';

export default Component.extend({
  classNames: ['explore-section'],
  more: 'explore.more',
  limit: 5,
  ajax: service(),
  store: service(),
  queryCache: service(),
  tasks: taskGroup().drop(),
  results: reads('tasks.last.value'),


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
  }).group('tasks'),

  getTrendingDataTask: task(function* () {
    const type = get(this, 'mediaType');
    const limit = get(this, 'limit');
    let path = `/trending/${type}?limit=${limit}`;

    // Append category information if this is for a category request
    if (get(this, 'category')) {
      const categoryId = get(this, 'category.id');
      path = `${path}&in_category=true&category=${categoryId}`;
    }

    // does a cache entry exist?
    const cachedRecords = yield get(this, 'queryCache').get('trending', path);
    if (cachedRecords) {
      return cachedRecords;
    }

    // query the trending API
    const response = yield get(this, 'ajax').request(path);
    if (typeOf(response.data) !== 'array') {
      return [];
    }
    const records = [];
    response.data.forEach(data => {
      const normalize = get(this, 'store').normalize(type, data);
      const record = get(this, 'store').push(normalize);
      records.addObject(record);
    });

    // push into cache
    get(this, 'queryCache').push('trending', path, records);
    return records;
  }).group('tasks'),

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
