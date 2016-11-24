import Component from 'ember-component';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task, taskGroup } from 'ember-concurrency';
import errorMessage from 'client/utils/error-messages';
import { invokeAction } from 'ember-invoke-action';
import { underscore } from 'ember-string';

export default Component.extend({
  identification: undefined,
  password: undefined,
  errorMessage: undefined,

  facebook: service(),
  session: service(),
  authentication: taskGroup().drop(),

  login: task(function* () {
    const { identification, password } = getProperties(this, 'identification', 'password');
    yield get(this, 'session')
      .authenticateWithOAuth2(identification, password)
      .then(() => invokeAction(this, 'close'))
      .catch(err => set(this, 'errorMessage', errorMessage(err)));
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
          }).catch((err) => {
            set(this, 'errorMessage', errorMessage(err));
          });
        }
      });
  }).group('authentication'),

  actions: {
    changeComponent(component) {
      invokeAction(this, 'changeComponent', component);
    }
  }
});
