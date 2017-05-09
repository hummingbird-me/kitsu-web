import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/characters',
  intl: service(),

  model(...args) {
    const media = this._getParentModel();
    const filters = this._getFilters(...args);
    return {
      taskInstance: this.queryPaginated('casting', {
        filter: Object.assign({
          media_type: capitalize(get(media, 'modelType')),
          media_id: get(media, 'id'),
          is_character: true
        }, filters),
        include: 'character,person',
        sort: '-featured'
      }),
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

  _getFilters() {
    return {};
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
