import Component from '@ember/component';
import { get } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    createLibraryEntry(status, rating) {
      if (!get(this, 'session.hasUser')) {
        return get(this, 'session').signUpModal();
      }
      invokeAction(this, 'onCreate', status, rating);
    }
  }
});
