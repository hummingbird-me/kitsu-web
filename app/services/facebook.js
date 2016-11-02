import Service from 'ember-service';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import RSVP from 'rsvp';

export default Service.extend({
  ajax: service(),
  torii: service(),

  connect(user) {
    return new RSVP.Promise((resolve, reject) => {
      get(this, 'torii').open('facebook', {})
        .then(response => resolve(response)).catch(err => reject(err));
    }).then((response) => {
      set(user, 'facebookId', get(response, 'userId'));
      return user.save().catch(() => user.rollbackAttributes());
    });
  },

  disconnect(user) {
    set(user, 'facebookId', null);
    return user.save().catch(() => user.rollbackAttributes());
  },

  getUserData() {
    if (this._isInitialized() === false) {
      throw new Error('Facebook not initialized.');
    }
    return new RSVP.Promise((resolve) => {
      window.FB.api('/me', { fields: 'id,name,email,gender' }, (response) => {
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
