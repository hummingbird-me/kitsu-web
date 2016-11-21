import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import { underscore } from 'ember-string';

export default Component.extend({
  facebook: service(),
  session: service(),

  authenticateWithFacebook: task(function* () {
    yield get(this, 'session').authenticateWithFacebook()
      .then(() => invokeAction(this, 'close'))
      .catch((error) => {
        // Facebook succeeded but Kitsu failed (no-account)
        if (error.error === 'invalid_grant') {
          get(this, 'facebook').getUserData().then((response) => {
            const data = { ...response, name: underscore(get(response, 'name')) };
            invokeAction(this, 'changeComponent', 'sign-up', data);
          }).catch(() => { /* TODO: Feedback */ });
        }
      });
  }).drop(),

  actions: {
    changeComponent(component) {
      invokeAction(this, 'changeComponent', component);
    }
  }
});
