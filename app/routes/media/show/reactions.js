import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/reactions',
  intl: service(),

  model() {
    const media = this._getParentModel();
    const type = get(media, 'modelType');
    const sort = get(this, 'sort');
    return {
      taskInstance: this.queryPaginated('media-reaction', {
        include: 'user',
        filter: {
          [`${type}Id`]: get(media, 'id'),
        },
        page: { limit: 6 },
        sort
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
    return get(this, 'intl').t('titles.media.show.reactions', { title });
  },

  _getParentModel() {
    const [mediaType] = get(this, 'routeName').split('.');
    return this.modelFor(`${mediaType}.show`);
  }
});
