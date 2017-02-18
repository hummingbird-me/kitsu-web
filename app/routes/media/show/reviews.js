import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import InfinitePagination from 'client/mixins/infinite-pagination';

export default Route.extend(InfinitePagination, {
  templateName: 'media/show/reviews',
  intl: service(),

  model() {
    return {
      taskInstance: get(this, 'modelTask').perform(),
      paginatedRecords: []
    };
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

  modelTask: task(function* () {
    const media = this._getParentModel();
    const options = {
      include: 'user,media',
      filter: {
        media_type: capitalize(get(media, 'modelType')),
        media_id: get(media, 'id')
      },
      sort: '-likes_count'
    };
    return yield get(this, 'store').query('review', options).then((records) => {
      this.updatePageState(records);
      return records;
    });
  }),

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
