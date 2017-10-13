import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { classify } from '@ember/string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/franchise',
  intl: service(),

  model() {
    const media = this._getParentModel();
    return {
      taskInstance: this.queryPaginated('media-relationship', {
        filter: {
          source_id: get(media, 'id'),
          source_type: classify(get(media, 'modelType'))
        },
        include: 'destination',
        sort: 'role'
      }),
      paginatedRecords: []
    };
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'media', this._getParentModel());
  },

  titleToken() {
    return get(this, 'intl').t('titles.media.show.franchise');
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
