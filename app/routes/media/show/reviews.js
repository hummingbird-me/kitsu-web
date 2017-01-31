import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  templateName: 'media/show/reviews',

  modelTask: task(function* () {
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const media = this.modelFor(parentRoute);
    const results = yield get(this, 'store').query('review', {
      include: 'user,media',
      filter: {
        media_type: capitalize(get(media, 'modelType')),
        media_id: get(media, 'id')
      },
      sort: '-likes_count'
    });
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'taskValue', results);
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  },

  setupController(controller) {
    this._super(...arguments);
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const parentController = this.controllerFor(parentRoute);
    set(controller, 'media', get(parentController, 'media'));
  }
});
