import Route from 'ember-route';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';

export default Route.extend({
  intl: service(),

  setupController(controller) {
    this._super(...arguments);
    const { type } = this.paramsFor('explore.category.more');
    const { media_type: mediaType } = this.paramsFor('explore');
    const category = this.modelFor('explore.category');
    setProperties(controller, { type, mediaType, category });
  },

  titleToken() {
    console.log(this.paramsFor(get(this, 'routeName')), this.paramsFor('explore'));
    const { type } = this.paramsFor('explore.category.more');
    const { media_type: mediaType } = this.paramsFor('explore');
    const category = this.modelFor('explore.category');
    const title = get(this, 'intl').t(`titles.explore.category.more.${type}`, {
      type: capitalize(mediaType),
      category: get(category, 'title')
    });
    set(this, 'breadcrumb', title);
    return title;
  }
});
