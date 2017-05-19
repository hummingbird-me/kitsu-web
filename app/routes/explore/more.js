import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  model(params) {
    const mediaType = this.paramsFor('explore').type;
    return {
      taskInstance: this.queryPaginated(mediaType, this.buildOptions(params.name)),
      paginatedRecords: []
    };
  },

  buildOptions(moreType) {
    const options = {
      page: { limit: 20 },
      filter: {}
    };
    switch (moreType) {
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
    const moreType = this.paramsFor('explore.more').name;
    const mediaType = this.paramsFor('explore').type;
    setProperties(controller, { moreType, mediaType });
  }
});
