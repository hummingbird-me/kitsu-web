import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { underscore } from 'ember-string';

export default Component.extend({
  facebook: service(),
  session: service(),

  actions: {
    facebookLogin() {
      get(this, 'session').authenticateWithFacebook().catch((error) => {
        if (error.error === 'invalid_grant') {
          get(this, 'facebook').getUserData().then((response) => {
            const data = { ...response, name: underscore(get(response, 'name')) };
            set(this, 'showFacebookSignUp', true);
            set(this, 'facebookSignUpData', data);
          });
        } else {
          get(this, 'raven').logException(error);
        }
      });
    },

    joinCommunity() {
      get(this, 'session').signUpModal();
    }
  }
});
