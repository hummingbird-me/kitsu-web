import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';

export default Route.extend({
  templateName: 'media/show/index',
  queryCache: service(),

  modelTask: task(function* () {
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const media = this.modelFor(parentRoute);
    return yield get(this, 'queryCache').query('review', {
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
  },

  titleToken() {
    return get(this._getParentModel(), 'computedTitle');
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
