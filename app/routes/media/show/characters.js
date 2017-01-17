import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  templateName: 'media/show/characters',

  modelTask: task(function* (filters = {}) {
    const [mediaType] = get(this, 'routeName').split('.');
    const media = this.modelFor(`${mediaType}.show`);
    const results = yield get(this, 'store').query('casting', {
      filter: Object.assign({
        media_type: capitalize(mediaType),
        media_id: get(media, 'id'),
        is_character: true
      }, filters),
      include: 'character,person',
      sort: '-featured'
    });
    const controller = this.controllerFor(get(this, 'routeName'));
    set(controller, 'taskValue', results);
  }).restartable(),

  model(...args) {
    return { taskInstance: get(this, 'modelTask').perform(this._getFilters(...args)) };
  },

  setupController(controller) {
    this._super(...arguments);
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const parentController = this.controllerFor(parentRoute);
    set(controller, 'media', get(parentController, 'media'));
  },

  _getFilters() {
    return {};
  }
});
