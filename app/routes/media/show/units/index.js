import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/units/index',
  intl: service(),

  model() {
    const media = this._getParentModel();
    const mediaType = capitalize(get(media, 'modelType'));
    let unitType;
    let filter;
    if (mediaType === 'Anime') {
      unitType = 'episode';
      filter = { mediaType, media_id: get(media, 'id') };
    } else {
      unitType = 'chapter';
      filter = { manga_id: get(media, 'id') };
    }
    return {
      taskInstance: this.queryPaginated(unitType, {
        filter,
        sort: 'number'
      }),
      paginatedRecords: []
    };
  },

  setupController(controller) {
    this._super(...arguments);
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const parentController = this.controllerFor(parentRoute);
    set(controller, 'parent', parentController);
  },

  titleToken() {
    const media = this._getParentModel();
    return get(this, 'intl').t('titles.media.show.units', {
      type: get(media, 'modelType')
    });
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
