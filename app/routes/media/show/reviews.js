import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  templateName: 'media/show/reviews',
  intl: service(),

  modelTask: task(function* () {
    const media = this._getParentModel();
    return yield get(this, 'store').query('review', {
      include: 'user,media',
      filter: {
        media_type: capitalize(get(media, 'modelType')),
        media_id: get(media, 'id')
      },
      sort: '-likes_count'
    });
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'media', this._getParentModel());
  },

  titleToken() {
    const model = this._getParentModel();
    const title = get(model, 'computedTitle');
    return get(this, 'intl').t('titles.media.show.reviews', { title });
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
