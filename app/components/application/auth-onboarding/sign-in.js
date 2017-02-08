import Component from 'ember-component';
import get, { getProperties } from 'ember-metal/get';
import service from 'ember-service/inject';
import { task, taskGroup } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';
import { invokeAction } from 'ember-invoke-action';
import { underscore } from 'ember-string';

export default Component.extend({
  identification: undefined,
  password: undefined,

  facebook: service(),
  notify: service(),
  router: service('-routing'),
  authentication: taskGroup().drop(),

  login: task(function* () {
    const { identification, password } = getProperties(this, 'identification', 'password');
    yield get(this, 'session')
      .authenticateWithOAuth2(identification, password)
      .then(() => invokeAction(this, 'close'))
      .catch(err => get(this, 'notify').error(errorMessages(err)));
  }).group('authentication'),

  loginWithFacebook: task(function* () {
    yield get(this, 'session').authenticateWithFacebook()
      .then(() => invokeAction(this, 'close'))
      .catch((error) => {
        // Facebook succeeded but Kitsu failed (no-account)
        if (error.error === 'invalid_grant') {
          get(this, 'facebook').getUserData().then((response) => {
            const data = { ...response, name: underscore(get(response, 'name')) };
            invokeAction(this, 'changeComponent', 'sign-up', data);
          }).catch(err => get(this, 'notify').error(errorMessages(err)));
        }
      });
  }).group('authentication'),

  actions: {
    changeComponent(component) {
      invokeAction(this, 'changeComponent', component);
    },

    transitionToForgot() {
      get(this, 'modal').$('.modal').on('hidden.bs.modal', () => {
        get(this, 'router').transitionTo('password-reset');
      }).modal('hide');
    }
  }
});
