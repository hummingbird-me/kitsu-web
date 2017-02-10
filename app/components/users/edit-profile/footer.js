import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  actions: {
    updateProfile() {
      get(this, 'updateTask').perform().then(() => {
        invokeAction(this, 'onUpdate');
      }).catch((errors) => {
        const firstError = get(errors, 'firstObject.reason');
        set(this, 'errorMessage', errorMessages(firstError));
      });
    }
  }
});
