import Route from 'ember-route';
import get from 'ember-metal/get';

export default Route.extend({
  templateName: 'media/show/installments',

  model() {
    const [mediaType] = get(this, 'routeName').split('.');
    const media = this.modelFor(`${mediaType}.show`);
    return get(this, 'store').query('installment', {
      include: 'franchise',
      filter: { media_id: get(media, 'id') },
      sort: 'position'
    });
  }
});
