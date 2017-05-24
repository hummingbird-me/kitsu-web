import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['explore-section'],
  more: 'explore.more',
  store: service(),
  limit: 5,

  init() {
    this._super(...arguments);
    get(this, 'getDataTask').perform().catch((error) => {
      get(this, 'raven').captureException(error);
    });
  },

  buildOptions() {
    const options = {
      page: { limit: get(this, 'limit') },
      filter: {}
    };
    const sort = get(this, 'sort');
    const filters = get(this, 'filters');
    if (sort) { options.sort = sort; }
    if (filters) {
      filters.split(',').forEach((filter) => {
        const f = filter.split(':');
        options.filter[f[0]] = f[1];
      });
    }
    // const category = get(this, 'category');
    // if (category) {
    //   filter.categories = get(category, 'slug');
    // }
    return options;
  },

  getDataTask: task(function* () {
    return yield get(this, 'store')
      .query(get(this, 'mediaType'), this.buildOptions());
  }).restartable()
});
