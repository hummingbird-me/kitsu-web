import Component from '@ember/component';
import { get, getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, taskGroup } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';
import { invokeAction } from 'ember-invoke-action';
import { underscore } from '@ember/string';

export default Component.extend({
  identification: undefined,
  password: undefined,

  facebook: service(),
  notify: service(),
  aozoraConflicts: service(),
  router: service('-routing'),
  authentication: taskGroup().drop(),

  login: task(function* () {
    const { identification, password } = getProperties(this, 'identification', 'password');
    try {
      yield get(this, 'session').authenticateWithOAuth2(identification, password);
      yield get(this, 'gotoNext').perform();
    } catch (err) {
      get(this, 'notify').error(errorMessages(err));
    }
  }).group('authentication'),

  loginWithFacebook: task(function* () {
    try {
      yield get(this, 'session').authenticateWithFacebook();
      yield get(this, 'gotoNext').perform();
    } catch (error) {
      // Facebook succeeded but Kitsu failed (no-account)
      if (error.error === 'invalid_grant') {
        try {
          const response = get(this, 'facebook').getUserData();
          const data = { ...response, name: underscore(get(response, 'name')) };
          invokeAction(this, 'changeComponent', 'sign-up', data);
        } catch (err) {
          get(this, 'notify').error(errorMessages(err));
        }
      }
    }
  }).group('authentication'),

  gotoNext: task(function* () {
    const user = yield get(this, 'session').getCurrentUser();
    if (user) {
      const conflicts = yield get(this, 'aozoraConflicts').list();
      if (conflicts.length > 1) {
        invokeAction(this, 'changeComponent', 'aozora-conflict');
      } else {
        invokeAction(this, 'changeComponent', 'aozora-account-details');
      }
    } else {
      invokeAction(this, 'close');
    }
  }),

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
