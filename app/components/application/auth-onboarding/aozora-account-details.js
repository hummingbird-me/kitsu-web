import SignUp from 'client/components/application/auth-onboarding/sign-up';
import { get, set } from '@ember/object';
import { task } from 'ember-concurrency';
import { alias } from '@ember/object/computed';
import errorMessages from 'client/utils/error-messages';
import { invokeAction } from 'ember-invoke-action';

export default SignUp.extend({
  user: alias('session.account'),

  _setupUser() {},

  updateAccount: task(function* () {
    set(this, 'user.status', 'registered');
    try {
      yield get(this, 'user').save();
    } catch (err) {
      get(this, 'notify').error(errorMessages(err));
    }
    invokeAction(this, 'close');
  }).drop()
});
