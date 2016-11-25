import Route from 'ember-route';
import get from 'ember-metal/get';
import { modelType } from 'client/helpers/model-type';

export default Route.extend({
  templateName: 'media/show/episodes',

  model() {
    const [mediaType] = get(this, 'routeName').split('.');
    const media = this.modelFor(`${mediaType}.show`);
    return get(this, 'store').query('episode', {
      filter: {
        media_type: modelType([media]),
        media_id: get(media, 'id')
      }
    });
  }
});
