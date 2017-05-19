import Route from 'ember-route';
import { setProperties } from 'ember-metal/set';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  setupController(controller) {
    this._super(...arguments);
    const type = this.paramsFor('explore.category.more').type;
    const mediaType = this.paramsFor('explore').media_type;
    const categoryName = this.paramsFor('explore.category').name;
    setProperties(controller, { type, mediaType, categoryName });
  }
});
