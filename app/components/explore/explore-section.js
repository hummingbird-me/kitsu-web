import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { reads } from 'ember-computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['explore-section'],
  more: 'explore.more',
  limit: 5,
  queryCache: service(),
  results: reads('getDataTask.last.value'),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getDataTask').perform();
  },

  getDataTask: task(function* () {
    const type = get(this, 'mediaType');
    const options = this._getRequestOptions();
    return yield get(this, 'queryCache').query(type, options);
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
