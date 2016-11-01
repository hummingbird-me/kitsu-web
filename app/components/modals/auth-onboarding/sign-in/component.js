import Component from 'ember-component';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task, taskGroup } from 'ember-concurrency';
import errorMessage from 'client/utils/error-messages';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  identification: undefined,
  password: undefined,
  errorMessage: undefined,

  session: service(),
  authentication: taskGroup().drop(),

  login: task(function* () {
    const { identification, password } = getProperties(this, 'identification', 'password');
    yield get(this, 'session')
      .authenticateWithOAuth2(identification, password)
      .then(() => invokeAction(this, 'close'))
      .catch(err => set(this, 'errorMessage', errorMessage(err)));
  }).group('authentication'),

  facebook: task(function* () {
    yield get(this, 'session').authenticateWithFacebook()
      .then(() => invokeAction(this, 'close'))
      .catch(() => invokeAction(this, 'changeComponent', 'social-auth'));
  }).group('authentication'),

  actions: {
    changeComponent(component) {
      invokeAction(this, 'changeComponent', component);
    }
  }
});
