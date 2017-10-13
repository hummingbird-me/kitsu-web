import Route from '@ember/routing/route';
import { set } from '@ember/object';

export default Route.extend({
  resetController(controller) {
    set(controller, 'password', null);
    set(controller, 'passwordConfirm', null);
  }
});
