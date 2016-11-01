import Service from 'ember-service';
import RSVP from 'rsvp';

export default Service.extend({
  getUserData() {
    if (this._isInitialized() === false) {
      throw new Error('Facebook not initialized.');
    }
    return new RSVP.Promise((resolve) => {
      window.FB.api('/me', { fields: 'name,email' }, (response) => {
        resolve(response);
      });
    });
  },

  _isInitialized() {
    return window.FB !== undefined;
  }
});
