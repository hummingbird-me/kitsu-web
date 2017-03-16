import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import { task } from 'ember-concurrency';
import Pagination from 'client/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/characters',
  intl: service(),

  model(...args) {
    return {
      taskInstance: get(this, 'modelTask').perform(this._getFilters(...args)),
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
    return get(this, 'intl').t('titles.media.show.characters', { title });
  },

  modelTask: task(function* (filters = {}) {
    const media = this._getParentModel();
    const options = {
      filter: Object.assign({
        media_type: capitalize(get(media, 'modelType')),
        media_id: get(media, 'id'),
        is_character: true
      }, filters),
      include: 'character,person',
      sort: '-featured'
    };
    return yield this.queryPaginated('casting', options);
  }).restartable(),

  _getFilters() {
    return {};
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
