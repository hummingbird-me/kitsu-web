import Session from 'ember-simple-auth/services/session';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isPresent } from 'ember-utils';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import jQuery from 'jquery';

export default Session.extend({
  ajax: service(),
  store: service(),

  hasUser: computed('isAuthenticated', 'account', function() {
    return get(this, 'isAuthenticated') && isPresent(get(this, 'account'));
  }).readOnly(),

  authenticateWithOAuth2(identification, password) {
    return this.authenticate('authenticator:oauth2', identification, password);
  },

  authenticateWithFacebook() {
    return this.authenticate('authenticator:assertion', 'facebook');
  },

  /**
   * Determine if the user is the same as the sessioned user.
   */
  isCurrentUser(user) {
    const hasUser = get(this, 'hasUser');
    if (!hasUser || !user) { return false; }
    const sessionId = get(this, 'account.id');
    const userId = get(user, 'id') || user;
    return sessionId === userId;
  },

  /**
   * Get the account information for the sessioned user
   */
  getCurrentUser() {
    const requestUrl = '/users?filter[self]=true&include=userRoles.role,userRoles.user';
    return get(this, 'ajax').request(requestUrl).then((response) => {
      // push the user data into the store
      const [data] = response.data;
      const normalizedData = get(this, 'store').normalize('user', data);
      const user = get(this, 'store').push(normalizedData);
      // push any included data into the store
      const included = response.included || [];
      included.forEach((record) => {
        let type = get(record, 'type');
        type = type === 'userRoles' ? 'user-role' : 'role';
        get(this, 'store').push(get(this, 'store').normalize(type, record));
      });
      // set reference of the user
      set(this, 'account', user);
      return user;
    }).catch(() => {
      this.invalidate();
    });
  },

  signUpModal() {
    jQuery('#sign-up-button').click();
  }
});
