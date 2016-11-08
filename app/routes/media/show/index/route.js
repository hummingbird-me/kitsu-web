import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Route.extend({
  templateName: 'media/show/index',

  setupController(controller) {
    this._super(...arguments);
    const [mediaType] = get(this, 'routeName').split('.');
    set(controller, 'media', this.modelFor(`${mediaType}.show`));
  }
});
