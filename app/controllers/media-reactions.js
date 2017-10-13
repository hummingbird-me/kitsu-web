import Controller from '@ember/controller';
import { get } from '@ember/object';

export default Controller.extend({
  actions: {
    signUp() {
      get(this, 'session.signUpModal')();
    }
  }
});
