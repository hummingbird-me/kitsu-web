import Component from '@ember/component';
import { get, set } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  actions: {
    updateProfile() {
      get(this, 'updateTask').perform().then(() => {
        invokeAction(this, 'onUpdate');
      }).catch(errors => {
        const firstError = get(errors, 'firstObject.reason');
        set(this, 'errorMessage', errorMessages(firstError));
      });
    }
  }
});
