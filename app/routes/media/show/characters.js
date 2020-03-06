import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/characters',
  intl: service(),

  model(...args) {
    const media = this._getParentModel();
    const filters = this._getFilters(...args);
    return {
      taskInstance: this.queryPaginated('casting', {
        filter: { media_type: capitalize(get(media, 'modelType')),
          media_id: get(media, 'id'),
          is_character: true,
          ...filters },
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
    return get(this, 'intl').t('titles.media.show.characters');
  },

  _getFilters() {
    return {};
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
