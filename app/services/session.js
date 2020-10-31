import Session from 'ember-simple-auth/services/session';
import { get, set, computed, getProperties } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import DS from 'ember-data';
import jQuery from 'jquery';

export default Session.extend({
  store: service(),
  raven: service(),

  error: null,

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
   * Get the access token.  Returns undefined when not authenticated.
   */
  token: computed('isAuthenticated', 'data.authenticated', function() {
    if (!this.isAuthenticated) return;

    return get(this, 'data.authenticated.access_token');
  }),

  /**
   * Get the account information for the sessioned user
   */
  async getCurrentUser() {
    const { store, raven } = getProperties(this, 'store', 'raven');
    try {
      // Load the current user
      const users = await store.query('user', {
        filter: { self: true },
        include: 'userRoles.role,userRoles.user'
      });
      const user = get(users, 'firstObject');
      // If no user was found, throw an unauthorized error
      if (!user) throw new DS.UnauthorizedError();

      run(() => set(this, 'account', user));
      return user;
    } catch (error) {
      const status = get(error, 'errors.firstObject.status');
      // Capture 5xx errors but don't invalidate the session
      if (status && status.charAt(0) === '5') {
        set(this, 'error', 'serverError');
        raven.captureException(error);
      } else {
        raven.captureException(error);
        run(() => this.invalidate());
        throw error;
      }
    }
  },

  signUpModal() {
    jQuery('#sign-up-button').click();
  }
});
