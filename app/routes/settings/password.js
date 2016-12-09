import Route from 'ember-route';
import set from 'ember-metal/set';

export default Route.extend({
  resetController(controller) {
    set(controller, 'password', null);
    set(controller, 'passwordConfirm', null);
  }
});
