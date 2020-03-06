import Service, { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import RSVP from 'rsvp';

// TODO: Refactor into generic oauth2 service
export default Service.extend({
  ajax: service(),
  torii: service(),

  connect(user) {
    return new RSVP.Promise((resolve, reject) => {
      get(this, 'torii').open('facebook', {})
        .then(response => resolve(response)).catch(err => reject(err));
    }).then(response => {
      set(user, 'facebookId', get(response, 'userId'));
      return user.save().catch(error => {
        set(user, 'facebookId', null);
        throw error;
      });
    });
  },

  disconnect(user) {
    const id = get(user, 'facebookId');
    set(user, 'facebookId', null);
    return user.save().catch(error => {
      set(user, 'facebookId', id);
      throw error;
    });
  },

  getUserData() {
    if (this._isInitialized() === false) {
      throw new Error('Facebook not initialized.');
    }
    return new RSVP.Promise(resolve => {
      window.FB.api('/me', { fields: 'id,name,email,gender' }, response => {
        resolve(response);
      });
    });
  },

  importFriends() {
    if (this._isInitialized() === false) {
      throw new Error('Facebook not initialized.');
    }
    return new RSVP.Promise((resolve, reject) => {
      window.FB.getLoginStatus(({ status, authResponse }) => {
        if (status === 'connected') {
          get(this, 'ajax').request('/follows/import_from_facebook', {
            method: 'POST',
            dataType: 'json',
            data: { assertion: authResponse.accessToken }
          }).then(response => resolve(response)).catch(err => reject(err));
        } else {
          get(this, 'torii').open('facebook', {}).then(() => this.importFriends());
        }
      });
    });
  },

  _isInitialized() {
    return window.FB !== undefined;
  }
});
