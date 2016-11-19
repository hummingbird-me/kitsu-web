import Route from 'ember-route';
import get from 'ember-metal/get';
import { capitalize } from 'ember-string';
import { modelType } from 'client/helpers/model-type';
import PaginationMixin from 'client/mixins/routes/pagination';

export default Route.extend(PaginationMixin, {
  templateName: 'media/show/reviews',

  model() {
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const media = this.modelFor(parentRoute);
    return get(this, 'store').query('review', {
      include: 'user',
      filter: {
        media_type: capitalize(modelType([media])),
        media_id: get(media, 'id')
      }
    });
  }
});
