import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, getProperties, setProperties, computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { and, alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import errorMessages from 'client/utils/error-messages';
import { invokeAction } from 'ember-invoke-action';
import strength from 'password-strength';

export default Component.extend({
  metrics: service(),
  notify: service(),
  store: service(),
  tracking: service(),

  user: alias('session.account'),

  hasValidName: and('user.name', 'user.validations.attrs.name.isValid'),
  hasValidEmail: and('user.email', 'user.validations.attrs.email.isValid'),
  hasValidPassword: and('user.password', 'user.validations.attrs.password.isValid'),

  hasInvalidName: and('user.name', 'user.validations.attrs.name.isInvalid'),
  hasInvalidEmail: and('user.email', 'user.validations.attrs.email.isInvalid'),
  hasInvalidPassword: and('user.password', 'user.validations.attrs.password.isInvalid'),

  passwordStrength: computed('user.password', function() {
    return strength(get(this, 'user.password') || '');
  }),

  updateAccount: task(function* () {
    set(this, 'user.status', 'registered');
    try {
      yield get(this, 'user').save();
    } catch (err) {
      get(this, 'notify').error(errorMessages(err));
    }
    invokeAction(this, 'close');
  }).drop(),

  actions: {
    focused(event) {
      const target = this.$('.auth-section').has(event.target);
      if (target.hasClass('active') === false) {
        target.addClass('active');
      }
    }
  }
});
