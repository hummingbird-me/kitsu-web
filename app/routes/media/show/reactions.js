import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  templateName: 'media/show/reactions',
  intl: service(),

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
