import Route from '@ember/routing/route';
import { get, set } from '@ember/object';

export default Route.extend({
  templateName: 'media/show/index',

  setupController(controller) {
    this._super(...arguments);
    const parentRoute = get(this, 'routeName').split('.').slice(0, 2).join('.');
    const parentController = this.controllerFor(parentRoute);
    set(controller, 'parent', parentController);
  }
});
