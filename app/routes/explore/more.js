import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  model(params) {
    const mediaType = this.paramsFor('explore').media_type;
    return {
      taskInstance: this.queryPaginated(mediaType, this.buildOptions(params.type)),
      paginatedRecords: []
    };
  },

  buildOptions(type) {
    const options = {
      page: { limit: 20 },
      filter: {}
    };
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
      default:
        options.sort = '-userCount';
    }
    return options;
  },

  setupController(controller) {
    this._super(...arguments);
    const type = this.paramsFor('explore.more').type;
    const mediaType = this.paramsFor('explore').media_type;
    setProperties(controller, { type, mediaType });
  }
});
