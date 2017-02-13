import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  templateName: 'media/show/episodes',
  intl: service(),

  modelTask: task(function* () {
    const media = this._getParentModel();
    return yield get(this, 'store').query('episode', {
      filter: {
        media_type: capitalize(get(media, 'modelType')),
        media_id: get(media, 'id')
      }
    });
  }),

  model() {
    return { taskInstance: get(this, 'modelTask').perform() };
  },

  titleToken() {
    const model = this._getParentModel();
    const title = get(model, 'computedTitle');
    return get(this, 'intl').t('titles.media.show.episodes', { title });
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
