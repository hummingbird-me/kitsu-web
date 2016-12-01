import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';
import { modelType } from 'client/helpers/model-type';

export default Route.extend({
  templateName: 'media/show/index',

  model() {
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const media = this.modelFor(parentRoute);
    return get(this, 'store').query('review', {
      include: 'user',
      filter: {
        media_id: get(media, 'id'),
        media_type: capitalize(modelType([media]))
      },
      page: { limit: 2 },
      sort: '-likes_count'
    });
  },

  setupController(controller) {
    this._super(...arguments);
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const parentController = this.controllerFor(parentRoute);
    set(controller, 'media', get(parentController, 'media'));
    set(controller, 'entry', get(parentController, 'entry'));
  }
});
