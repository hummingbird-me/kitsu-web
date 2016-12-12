import Component from 'ember-component';
import service from 'ember-service/inject';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import { task } from 'ember-concurrency';
import computed, { and } from 'ember-computed';
import { isPresent } from 'ember-utils';
import errorMessage from 'client/utils/error-messages';
import strength from 'password-strength';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  errorMessage: '',

  i18n: service(),
  metrics: service(),
  store: service(),
  session: service(),

  hasValidName: and('user.name', 'user.validations.attrs.name.isValid'),
  hasValidEmail: and('user.email', 'user.validations.attrs.email.isValid'),
  hasValidPassword: and('user.password', 'user.validations.attrs.password.isValid'),

  hasInvalidName: and('user.name', 'user.validations.attrs.name.isInvalid'),
  hasInvalidEmail: and('user.email', 'user.validations.attrs.email.isInvalid'),
  hasInvalidPassword: and('user.password', 'user.validations.attrs.password.isInvalid'),

  passwordStrength: computed('user.password', {
    get() {
      return strength(get(this, 'user.password') || '');
    }
  }),

  buttonText: computed('hasValidName', 'hasValidEmail', 'hasValidPassword', {
    get() {
      const { hasValidName, hasValidEmail, hasValidPassword }
        = getProperties(this, 'hasValidName', 'hasValidEmail', 'hasValidPassword');
      const allValid = hasValidName && hasValidEmail && hasValidPassword;
      let step = 'base';
      if (hasValidName && (!hasValidEmail && !hasValidPassword)) {
        step = 'first';
      } else if (hasValidEmail && (hasValidName && !hasValidPassword)) {
        step = 'second';
      } else if (allValid) {
        step = 'last';
      }
      return get(this, 'i18n').t(`auth.signUp.submit.${step}`);
    }
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
            set(user, 'password', undefined);
            invokeAction(this, 'changeComponent', 'import-select');
          })
          .catch(err => set(this, 'errorMessage', errorMessage(err)));
        const metrics = {
          category: 'account',
          action: 'create',
          value: get(this, 'user.id')
        };
        if (isPresent(get(user, 'facebookId'))) {
          metrics.label = 'facebook';
        }
        get(this, 'metrics').trackEvent(metrics);
      })
      .catch(err => set(this, 'errorMessage', errorMessage(err)));
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
