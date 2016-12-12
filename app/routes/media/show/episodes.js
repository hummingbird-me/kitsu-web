import Route from 'ember-route';
import get from 'ember-metal/get';
import { capitalize } from 'ember-string';
import { modelType } from 'client/helpers/model-type';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  templateName: 'media/show/episodes',

  model() {
    const [mediaType] = get(this, 'routeName').split('.');
    const media = this.modelFor(`${mediaType}.show`);
    return get(this, 'store').query('episode', {
      filter: {
        media_type: capitalize(modelType([media])),
        media_id: get(media, 'id')
      }
    });
  }
});
