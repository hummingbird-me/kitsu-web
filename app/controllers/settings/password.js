import Controller from '@ember/controller';
import { get, set, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),
  user: alias('session.account'),

  isValid: computed('user.password', 'passwordConfirm', function() {
    return isPresent(get(this, 'user.password'))
      && get(this, 'user.password') === get(this, 'passwordConfirm');
  }).readOnly(),

  updatePassword: task(function* () {
    yield get(this, 'user').save()
      .then(() => {
        set(this, 'user.password', null);
        get(this, 'notify').success('Password updated.');
      })
      .catch(err => {
        get(this, 'notify').error(errorMessages(err));
        get(this, 'user').rollbackAttributes();
      });
  }).drop()
});
