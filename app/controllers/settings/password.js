import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed, { alias } from 'ember-computed';
import service from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),
  session: service(),
  user: alias('session.account'),

  isValid: computed('user.password', 'passwordConfirm', {
    get() {
      return isPresent(get(this, 'user.password')) &&
        get(this, 'user.password') === get(this, 'passwordConfirm');
    }
  }).readOnly(),

  updatePassword: task(function* () {
    yield get(this, 'user').save()
      .then(() => {
        set(this, 'user.password', null);
        get(this, 'notify').success('Password updated.');
      })
      .catch((err) => {
        get(this, 'notify').error(errorMessages(err));
        get(this, 'user').rollbackAttributes();
      });
  }).drop()
});
