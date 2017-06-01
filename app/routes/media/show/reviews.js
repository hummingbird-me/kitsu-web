import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/reviews',
  intl: service(),

  model() {
    const media = this._getParentModel();
    return {
      taskInstance: this.queryPaginated('review', {
        include: 'user,media',
        filter: {
          media_type: capitalize(get(media, 'modelType')),
          media_id: get(media, 'id')
        },
        sort: '-likes_count'
      }),
      paginatedRecords: []
    };
  },

  setupController(controller) {
    this._super(...arguments);
    set(controller, 'media', this._getParentModel());
  },

  titleToken() {
    return get(this, 'intl').t('titles.media.show.reviews');
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
