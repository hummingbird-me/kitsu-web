import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { isEmpty } from 'ember-utils';
import { task } from 'ember-concurrency';
import QueryParams from 'ember-parachute';
import errorMessages from 'client/utils/error-messages';
import { Validations } from 'client/models/user';

const queryParams = new QueryParams({
  token: {
    defaultValue: null,
    refresh: true
  }
});

export default Controller.extend(queryParams.Mixin, Validations, {
  ajax: service(),
  notify: service(),

  /**
   * Password passes validation and matches the password confirmation.
   */
  passwordValid: computed('password', 'passwordConfirm', function() {
    return get(this, 'validations.attrs.password.isValid') &&
      get(this, 'password') === get(this, 'passwordConfirm');
  }).readOnly(),

  /**
   * Tell the server to send off an email to the supplied email/username account.
   */
  sendEmail: task(function* () {
    try {
      yield get(this, 'ajax').request('/users/_recover', {
        method: 'POST',
        data: JSON.stringify({ username: get(this, 'email') })
      });
      const message = 'Your password reset email has been sent! Please check your email.';
      get(this, 'notify').success(message, { closeAfter: 5000 });
      this.transitionToRoute('dashboard');
    } catch (error) {
      get(this, 'notify').error(errorMessages(error));
    }
  }).drop(),

  /**
   * Send the user's password change request upstream
   */
  resetPassword: task(function* () {
    // get the current user based off the token supplied as a query param
    let user = yield get(this, 'ajax').request('/users?filter[self]=true', {
      headers: {
        Authorization: `Bearer ${get(this, 'usableToken')}`
      }
    });

    // if we didn't get a response than it is most likely that the token wasn't associated
    // with a user.
    if (isEmpty(get(user, 'data')) === true) {
      return get(this, 'notify').error('The token is either invalid or expired.');
    }

    // send the request upstream to change the user's password
    user = get(user, 'data.firstObject');
    try {
      yield get(this, 'ajax').request(`/users/${get(user, 'id')}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${get(this, 'usableToken')}`
        },
        data: JSON.stringify({
          data: {
            type: 'users',
            id: get(user, 'id'),
            attributes: { password: get(this, 'password') }
          }
        })
      });
      const message = 'Your password was successfully reset. Login using your new password.';
      get(this, 'notify').success(message, { closeAfter: 5000 });
      this.transitionToRoute('dashboard');
    } catch (error) {
      get(this, 'notify').error(errorMessages(error));
    }
  }).drop()
});
