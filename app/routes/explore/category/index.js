import Route from '@ember/routing/route';
import { get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';

export default Route.extend({
  intl: service(),

  setupController(controller) {
    this._super(...arguments);
    const { media_type: mediaType } = this.paramsFor('explore');
    const category = this.modelFor('explore.category');
    setProperties(controller, { mediaType, category });
  },

  titleToken() {
    const category = this.modelFor('explore.category');
    const { media_type: mediaType } = this.paramsFor('explore');
    return get(this, 'intl').t('titles.explore.category.index', {
      category: get(category, 'title'),
      type: capitalize(mediaType)
    });
  }
});
