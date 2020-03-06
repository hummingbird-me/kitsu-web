import Controller from '@ember/controller';
import { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Controller.extend({
  notify: service(),
  user: alias('session.account'),

  updateProfile: task(function* () {
    yield get(this, 'user').save()
      .then(() => get(this, 'notify').success('Your profile was updated.'))
      .catch(err => {
        get(this, 'notify').error(errorMessages(err));
        get(this, 'user').rollbackAttributes();
      });
  }).drop()
});
