import Component from 'ember-component';
import get, { getProperties } from 'ember-metal/get';
import { task } from 'ember-concurrency';
import { concat } from 'client/utils/computed-macros';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Component.extend(Pagination, {
  classNames: ['explore-more'],
  media: concat('getMediaTask.last.value', 'paginatedRecords'),

  init() {
    this._super(...arguments);
    get(this, 'getMediaTask').perform();
  },

  buildOptions(type) {
    const options = {
      page: { limit: 20 },
      filter: {}
    };
    // const category = get(this, 'category');
    // if (category) {
    //   options.filter.categories = get(category, 'slug');
    // }
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
        options.filter.status = 'current';
        break;
      case 'trending':
      default:
        options.sort = '-userCount';
    }
    return options;
  },

  getMediaTask: task(function* () {
    const { mediaType, type } = getProperties(this, 'mediaType', 'type');
    return yield this.queryPaginated(mediaType, this.buildOptions(type));
  })
});
