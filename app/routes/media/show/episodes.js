import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import InfinitePagination from 'client/mixins/infinite-pagination';

export default Route.extend(InfinitePagination, {
  templateName: 'media/show/episodes',
  intl: service(),

  model() {
    return {
      taskInstance: get(this, 'modelTask').perform(),
      paginatedElements: []
    };
  },

  titleToken() {
    const model = this._getParentModel();
    const title = get(model, 'computedTitle');
    return get(this, 'intl').t('titles.media.show.episodes', { title });
  },

  modelTask: task(function* () {
    const media = this._getParentModel();
    const options = {
      filter: {
        media_type: capitalize(get(media, 'modelType')),
        media_id: get(media, 'id')
      }
    };
    return yield get(this, 'store').query('episode', options).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }),

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
