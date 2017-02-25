import Component from 'ember-component';
import service from 'ember-service/inject';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import { task } from 'ember-concurrency';
import computed, { and } from 'ember-computed';
import { isPresent } from 'ember-utils';
import errorMessages from 'client/utils/error-messages';
import { invokeAction } from 'ember-invoke-action';
/* global zxcvbn */

export default Component.extend({
  metrics: service(),
  notify: service(),
  store: service(),
  tracking: service(),

  hasValidName: and('user.name', 'user.validations.attrs.name.isValid'),
  hasValidEmail: and('user.email', 'user.validations.attrs.email.isValid'),
  hasValidPassword: and('user.password', 'user.validations.attrs.password.isValid'),

  hasInvalidName: and('user.name', 'user.validations.attrs.name.isInvalid'),
  hasInvalidEmail: and('user.email', 'user.validations.attrs.email.isInvalid'),
  hasInvalidPassword: and('user.password', 'user.validations.attrs.password.isInvalid'),

  passwordStrength: computed('user.password', function() {
    return zxcvbn(get(this, 'user.password') || '');
  }),

  step: computed('hasValidName', 'hasValidEmail', 'hasValidPassword', function() {
    const { hasValidName, hasValidEmail, hasValidPassword }
      = getProperties(this, 'hasValidName', 'hasValidEmail', 'hasValidPassword');
    const allValid = hasValidName && hasValidEmail && hasValidPassword;
    let step = 0;
    if (hasValidName && (!hasValidEmail && !hasValidPassword)) {
      step = 1;
    } else if (hasValidEmail && (hasValidName && !hasValidPassword)) {
      step = 2;
    } else if (allValid) {
      step = 3;
    }
    return step;
  }),

  init() {
    this._super(...arguments);
    const user = get(this, 'store').createRecord('user');
    set(this, 'user', user);

    // was data passed to this?
    const data = get(this, 'componentData');
    if (data !== undefined) {
      setProperties(user, {
        name: get(data, 'name'),
        email: get(data, 'email'),
        gender: get(data, 'gender'),
        facebookId: get(data, 'id')
      });
    }
  },

  createAccount: task(function* () {
    const user = get(this, 'user');
    yield user.save()
      .then(() => {
        const { name: identification, password } = getProperties(user, 'name', 'password');
        get(this, 'session')
          .authenticateWithOAuth2(identification, password)
          .then(() => {
            set(user, 'password', null);
            invokeAction(this, 'changeComponent', 'import-select');
          })
          .catch(err => get(this, 'notify').error(errorMessages(err)));
        const metrics = {
          category: 'account',
          action: 'create',
          value: get(this, 'user.id')
        };
        if (isPresent(get(user, 'facebookId'))) {
          metrics.label = 'facebook';
        }
        get(this, 'metrics').trackEvent(metrics);
        get(this, 'tracking').googleTrackConversion(863549170, 'jvhFCLzuhG0Q8u3imwM');
        get(this, 'tracking').facebookTrackConversion('CompleteRegistration', {
          value: 25.00,
          currency: 'USD'
        });
      })
      .catch(err => get(this, 'notify').error(errorMessages(err)));
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
