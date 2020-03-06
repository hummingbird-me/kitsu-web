import Component from '@ember/component';
import { get, getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { typeOf } from '@ember/utils';
import { task, taskGroup } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  tagName: '',
  ajax: service(),
  store: service(),
  queryCache: service(),
  tasks: taskGroup().drop(),
  media: concat('tasks.last.value', 'paginatedRecords'),

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'type') === 'trending') {
      get(this, 'getTrendingTask').perform();
    } else {
      get(this, 'getMediaTask').perform();
    }
  },

  getMediaTask: task(function* () {
    const { mediaType, type } = getProperties(this, 'mediaType', 'type');
    return yield this.queryPaginated(mediaType, this._buildOptions(type));
  }).group('tasks'),

  getTrendingTask: task(function* () {
    const type = get(this, 'mediaType');
    let path = `/trending/${type}?limit=20`;

    // Append category information if this is for a category request
    if (get(this, 'category')) {
      const categoryId = get(this, 'category.id');
      path = `${path}&in_category=true&category=${categoryId}`;
    }

    // try get from cache
    const cachedRecords = yield get(this, 'queryCache').get('trending', path);
    if (cachedRecords) {
      return cachedRecords;
    }

    // yield the request
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

    // cache the records
    get(this, 'queryCache').push('trending', path, records);
    return records;
  }).group('tasks'),

  _buildOptions(type) {
    const options = {
      page: { limit: 20 },
      filter: {}
    };

    const category = get(this, 'category');
    if (category) {
      options.filter.categories = get(category, 'slug');
    }

    switch (type) {
      case 'top-current':
        options.sort = '-userCount';
        options.filter.status = 'current';
        break;
      case 'top-upcoming':
        options.sort = '-userCount';
        options.filter.status = 'upcoming';
        break;
      case 'highest-rated':
        options.sort = '-averageRating';
        break;
      case 'most-popular':
        options.sort = '-userCount';
        break;
      case 'newly-released':
        options.sort = '-startDate';
        options.filter.status = 'current,finished';
        break;
      default:
        options.sort = '-userCount';
    }
    return options;
  }
});
