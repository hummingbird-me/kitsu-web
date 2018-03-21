import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    set(controller, 'email', get(controller, 'inputEmail'));
    scheduleOnce('afterRender', () => set(controller, 'inputEmail', null));
  },

  resetController(controller) {
    set(controller, 'email', null);
    set(controller, 'inputEmail', null);
  }
});
