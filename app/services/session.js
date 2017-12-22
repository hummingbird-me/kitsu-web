import Session from 'ember-simple-auth/services/session';
import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { UnauthorizedError } from 'ember-data';
import Raven from 'client/services/raven';
import jQuery from 'jquery';

export default Session.extend({
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
  async getCurrentUser() {
    const store = get(this, 'store');
    try {
      // Load the current user
      const user = get(await store.query('user', {
        filter: { self: true },
        include: 'userRoles.role,userRoles.user'
      }), 'firstObject');
      // If no user was found, throw an unauthorized error
      if (!user) throw new UnauthorizedError();

      run(() => set(this, 'account', user));
      return user;
    } catch (error) {
      const status = get(error, 'errors.firstObject.status');
      // Capture 5xx errors but don't invalidate the session
      if (status.charAt(0) === '5') {
        Raven.captureException(error);
      } else {
        Raven.captureException(error);
        run(() => this.invalidate());
        throw error;
      }
    }
  },

  signUpModal() {
    jQuery('#sign-up-button').click();
  }
});
