import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { invokeAction } from 'ember-invoke-action';
import { task } from 'ember-concurrency';
import { underscore } from '@ember/string';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  facebook: service(),
  notify: service(),

  authenticateWithFacebook: task(function* () {
    yield get(this, 'session').authenticateWithFacebook()
      .then(() => invokeAction(this, 'close'))
      .catch(error => {
        // Facebook succeeded but Kitsu failed (no account)
        if (error.error === 'invalid_grant') {
          get(this, 'facebook').getUserData().then(response => {
            const data = { ...response, name: underscore(get(response, 'name')) };
            invokeAction(this, 'changeComponent', 'sign-up', data);
          }).catch(err => get(this, 'notify').error(errorMessages(err)));
        }
      });
  }).drop(),

  actions: {
    changeComponent(component) {
      invokeAction(this, 'changeComponent', component);
    }
  }
});
