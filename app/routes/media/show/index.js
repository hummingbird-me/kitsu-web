import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';

export default Route.extend({
  templateName: 'media/show/index',

  modelTask: task(function* () {
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const media = this.modelFor(parentRoute);
    return yield get(this, 'store').query('review', {
      include: 'user',
      filter: {
        media_id: get(media, 'id'),
        media_type: capitalize(get(media, 'modelType'))
      },
      page: { limit: 2 },
      sort: '-likes_count'
    });
  }).restartable(),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  },

  setupController(controller) {
    this._super(...arguments);
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const parentController = this.controllerFor(parentRoute);
    set(controller, 'parent', parentController);
  }
});
