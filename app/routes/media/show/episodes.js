import Route from 'ember-route';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { capitalize } from 'ember-string';
import Pagination from 'kitsu-shared/mixins/pagination';

export default Route.extend(Pagination, {
  templateName: 'media/show/episodes',
  intl: service(),

  model() {
    const media = this._getParentModel();
    return {
      taskInstance: this.queryPaginated('episode', {
        filter: {
          media_type: capitalize(get(media, 'modelType')),
          media_id: get(media, 'id')
        },
        sort: 'seasonNumber,number'
      }),
      paginatedRecords: []
    };
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
