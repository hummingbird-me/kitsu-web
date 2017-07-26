import Controller from 'ember-controller';
import get from 'ember-metal/get';

export default Controller.extend({
  actions: {
    signUp() {
      get(this, 'session.signUpModal')();
    }
  }
});
