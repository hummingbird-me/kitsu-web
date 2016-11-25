import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import { task } from 'ember-concurrency';
import { isEmpty } from 'ember-utils';
import errorMessages from 'client/utils/error-messages';
import { Validations } from 'client/models/user';

export default Controller.extend(Validations, {
  queryParams: ['token'],
  token: null,
  usableToken: null,
  email: null,
  password: null,
  passwordConfirm: null,

  ajax: service(),
  notify: service(),

  passwordValid: computed('password', 'passwordConfirm', {
    get() {
      return get(this, 'validations.attrs.password.isValid') &&
        get(this, 'password') === get(this, 'passwordConfirm');
    }
  }).readOnly(),

  sendEmail: task(function* () {
    yield get(this, 'ajax').request('/users/_recover', {
      method: 'POST',
      data: JSON.stringify(get(this, 'email')),
      contentType: 'application/json'
    }).then(() => {
      get(this, 'notify').success('Your password reset email has been sent! Please check your email.', { closeAfter: 5000 });
      this.transitionToRoute('dashboard');
    }).catch(err => get(this, 'notify').error(errorMessages(err)));
  }).drop(),

  resetPassword: task(function* () {
    let user = yield get(this, 'ajax').request('/users?filter[self]=true', {
      headers: {
        Authorization: `Bearer ${get(this, 'usableToken')}`
      }
    }).catch(err => get(this, 'notify').error(errorMessages(err)));

    if (isEmpty(get(user, 'data')) === true) {
      return get(this, 'notify').error('The token is either invalid or expired.');
    }

    user = get(user, 'data.firstObject');
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
      }),
      contentType: 'application/vnd.api+json'
    }).then(() => {
      get(this, 'notify').success('Your password was successfully reset. Login using your new password.', { closeAfter: 5000 });
      this.transitionToRoute('dashboard');
    }).catch(err => get(this, 'notify').error(errorMessages(err)));
  }).drop()
});
